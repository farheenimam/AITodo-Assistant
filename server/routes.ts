import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertTaskSchema, insertPremiumRequestSchema } from "@shared/schema";
import { z } from "zod";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { OpenAI } from "openai";

const JWT_SECRET = process.env.SESSION_SECRET;
if (!JWT_SECRET) {
  throw new Error("SESSION_SECRET environment variable is required");
}
// Type assertion since we've validated it exists
const jwtSecret: string = JWT_SECRET;

// Middleware for authentication
const authenticateToken = async (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret) as any;
    const user = await storage.getUser(decoded.userId);
    if (!user) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
      }

      const user = await storage.createUser(userData);
      const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: '7d' });
      
      res.json({ 
        user: { 
          id: user.id, 
          name: user.name, 
          email: user.email, 
          isPremium: user.isPremium 
        }, 
        token 
      });
    } catch (error) {
      console.error("Signup error:", error);
      res.status(400).json({ error: "Invalid signup data" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password required" });
      }

      const user = await storage.getUserByEmail(email);
      if (!user || !user.password) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: '7d' });
      
      res.json({ 
        user: { 
          id: user.id, 
          name: user.name, 
          email: user.email, 
          isPremium: user.isPremium 
        }, 
        token 
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  app.get("/api/auth/me", authenticateToken, async (req: any, res) => {
    res.json({ 
      user: { 
        id: req.user.id, 
        name: req.user.name, 
        email: req.user.email, 
        isPremium: req.user.isPremium 
      } 
    });
  });

  // Task routes
  app.get("/api/tasks", authenticateToken, async (req: any, res) => {
    try {
      const tasks = await storage.getTasksByUserId(req.user.id);
      res.json({ tasks });
    } catch (error) {
      console.error("Get tasks error:", error);
      res.status(500).json({ error: "Failed to fetch tasks" });
    }
  });

  app.post("/api/tasks", authenticateToken, async (req: any, res) => {
    try {
      const taskData = insertTaskSchema.parse(req.body);
      const task = await storage.createTask(req.user.id, taskData);
      res.json({ task });
    } catch (error) {
      console.error("Create task error:", error);
      res.status(400).json({ error: "Invalid task data" });
    }
  });

  app.put("/api/tasks/:id", authenticateToken, async (req: any, res) => {
    try {
      const taskId = req.params.id;
      const updates = req.body;
      
      // Verify task belongs to user
      const existingTask = await storage.getTask(taskId);
      if (!existingTask || existingTask.userId !== req.user.id) {
        return res.status(404).json({ error: "Task not found" });
      }

      const task = await storage.updateTask(taskId, updates);
      res.json({ task });
    } catch (error) {
      console.error("Update task error:", error);
      res.status(400).json({ error: "Failed to update task" });
    }
  });

  app.delete("/api/tasks/:id", authenticateToken, async (req: any, res) => {
    try {
      const taskId = req.params.id;
      
      // Verify task belongs to user
      const existingTask = await storage.getTask(taskId);
      if (!existingTask || existingTask.userId !== req.user.id) {
        return res.status(404).json({ error: "Task not found" });
      }

      const deleted = await storage.deleteTask(taskId);
      res.json({ success: deleted });
    } catch (error) {
      console.error("Delete task error:", error);
      res.status(500).json({ error: "Failed to delete task" });
    }
  });

  // AI Suggestion endpoint - requires taskId and persists suggestion to task
  const aiSuggestionSchema = z.object({
    taskId: z.string().min(1, "Task ID is required"),
  });

  app.post("/api/tasks/suggestions", authenticateToken, async (req: any, res) => {
    try {
      // Validate request body
      const { taskId } = aiSuggestionSchema.parse(req.body);
      
      // Verify task exists and belongs to user
      const task = await storage.getTask(taskId);
      if (!task || task.userId !== req.user.id) {
        return res.status(404).json({ error: "Task not found" });
      }

      // Check if task already has AI suggestion
      if (task.aiSuggestion) {
        return res.status(400).json({ error: "Task already has an AI suggestion" });
      }

      // Check if user has exceeded free AI suggestion limit
      if (!req.user.isPremium) {
        const userTasks = await storage.getTasksByUserId(req.user.id);
        const aiSuggestionsUsed = userTasks.filter(t => t.aiSuggestion).length;
        const maxFreeSuggestions = 5;
        
        if (aiSuggestionsUsed >= maxFreeSuggestions) {
          return res.status(403).json({ 
            error: "AI suggestion limit reached. Upgrade to premium for unlimited suggestions." 
          });
        }
      }

      const aiApiKey = process.env.AI_API_KEY;
      if (!aiApiKey) {
        return res.status(500).json({ error: "AI service not configured" });
      }

      // Initialize OpenAI client with user's configuration
      const client = new OpenAI({
        baseURL: "https://api.aimlapi.com/v1",
        apiKey: aiApiKey,
      });

      // Generate context-aware prompt
      let prompt = `You are a productivity assistant. Analyze this task and provide a helpful suggestion for completing it efficiently:

Task: ${task.title}`;

      if (task.description) {
        prompt += `\nDescription: ${task.description}`;
      }
      if (task.priority) {
        prompt += `\nPriority: ${task.priority}`;
      }
      if (task.deadline) {
        prompt += `\nDeadline: ${task.deadline.toLocaleDateString()}`;
      }

      prompt += `\n\nProvide a concise, actionable suggestion (1-2 sentences) that helps the user complete this task more effectively. Focus on time management, task breakdown, or productivity tips.`;

      const response = await client.chat.completions.create({
        model: "meta-llama/Llama-3.3-70B-Instruct-Turbo",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        top_p: 0.7,
        frequency_penalty: 1,
        max_tokens: 1536,
      });

      // Robust response handling
      if (!response.choices || response.choices.length === 0) {
        return res.status(500).json({ error: "No AI suggestion generated" });
      }

      const suggestion = response.choices[0].message?.content?.trim();
      if (!suggestion) {
        return res.status(500).json({ error: "Empty AI suggestion generated" });
      }

      // Persist the suggestion to the task
      const updatedTask = await storage.updateTask(taskId, { aiSuggestion: suggestion });
      if (!updatedTask) {
        return res.status(500).json({ error: "Failed to save AI suggestion" });
      }

      res.json({ task: updatedTask });
    } catch (error) {
      console.error("AI suggestion error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid request data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to generate AI suggestion" });
    }
  });

  // Premium routes
  app.post("/api/premium/request", authenticateToken, async (req: any, res) => {
    try {
      const requestData = insertPremiumRequestSchema.parse(req.body);
      requestData.userId = req.user.id;
      
      const premiumRequest = await storage.createPremiumRequest(requestData);
      res.json({ premiumRequest });
    } catch (error) {
      console.error("Premium request error:", error);
      res.status(400).json({ error: "Failed to create premium request" });
    }
  });

  app.post("/api/premium/activate", authenticateToken, async (req: any, res) => {
    try {
      // TODO: Verify payment with Crossmint webhook/API
      // For now, just activate premium for demo
      const user = await storage.updateUser(req.user.id, { isPremium: true });
      res.json({ 
        user: { 
          id: user?.id, 
          name: user?.name, 
          email: user?.email, 
          isPremium: user?.isPremium 
        } 
      });
    } catch (error) {
      console.error("Premium activation error:", error);
      res.status(500).json({ error: "Failed to activate premium" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
