import { type User, type InsertUser, type Task, type InsertTask, type PremiumRequest, type InsertPremiumRequest } from "@shared/schema";
import { randomUUID } from "crypto";
import bcrypt from "bcrypt";

// Storage interface for the AI To-Do Assistant
export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;
  
  // Task operations
  getTask(id: string): Promise<Task | undefined>;
  getTasksByUserId(userId: string): Promise<Task[]>;
  createTask(userId: string, task: InsertTask): Promise<Task>;
  updateTask(id: string, updates: Partial<Task>): Promise<Task | undefined>;
  deleteTask(id: string): Promise<boolean>;
  
  // Premium request operations
  createPremiumRequest(request: InsertPremiumRequest): Promise<PremiumRequest>;
  updatePremiumRequest(id: string, updates: Partial<PremiumRequest>): Promise<PremiumRequest | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private tasks: Map<string, Task>;
  private premiumRequests: Map<string, PremiumRequest>;

  constructor() {
    this.users = new Map();
    this.tasks = new Map();
    this.premiumRequests = new Map();
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const hashedPassword = insertUser.password 
      ? await bcrypt.hash(insertUser.password, 10)
      : null;
    
    const user: User = { 
      id,
      name: insertUser.name,
      email: insertUser.email,
      password: hashedPassword,
      googleId: insertUser.googleId || null,
      isPremium: false,
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Task operations
  async getTask(id: string): Promise<Task | undefined> {
    return this.tasks.get(id);
  }

  async getTasksByUserId(userId: string): Promise<Task[]> {
    return Array.from(this.tasks.values()).filter(
      task => task.userId === userId
    );
  }

  async createTask(userId: string, insertTask: InsertTask): Promise<Task> {
    const id = randomUUID();
    const task: Task = {
      id,
      userId,
      title: insertTask.title,
      description: insertTask.description || null,
      deadline: insertTask.deadline || null,
      priority: insertTask.priority || "Medium",
      status: insertTask.status || "Incomplete",
      aiSuggestion: insertTask.aiSuggestion || null,
      createdAt: new Date()
    };
    this.tasks.set(id, task);
    return task;
  }

  async updateTask(id: string, updates: Partial<Task>): Promise<Task | undefined> {
    const task = this.tasks.get(id);
    if (!task) return undefined;
    
    const updatedTask = { ...task, ...updates };
    this.tasks.set(id, updatedTask);
    return updatedTask;
  }

  async deleteTask(id: string): Promise<boolean> {
    return this.tasks.delete(id);
  }

  // Premium request operations
  async createPremiumRequest(insertRequest: InsertPremiumRequest): Promise<PremiumRequest> {
    const id = randomUUID();
    const request: PremiumRequest = {
      id,
      userId: insertRequest.userId,
      solanaTxId: insertRequest.solanaTxId || null,
      status: insertRequest.status || "Pending",
      createdAt: new Date()
    };
    this.premiumRequests.set(id, request);
    return request;
  }

  async updatePremiumRequest(id: string, updates: Partial<PremiumRequest>): Promise<PremiumRequest | undefined> {
    const request = this.premiumRequests.get(id);
    if (!request) return undefined;
    
    const updatedRequest = { ...request, ...updates };
    this.premiumRequests.set(id, updatedRequest);
    return updatedRequest;
  }
}

export const storage = new MemStorage();
