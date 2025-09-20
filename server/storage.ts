import { type User, type InsertUser, type Task, type InsertTask, type PremiumRequest, type InsertPremiumRequest, users, tasks, premiumRequests } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
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

// DatabaseStorage implementation using PostgreSQL via Drizzle ORM
// Referenced from javascript_database integration
export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const hashedPassword = insertUser.password 
      ? await bcrypt.hash(insertUser.password, 10)
      : null;
    
    const [user] = await db
      .insert(users)
      .values({
        ...insertUser,
        password: hashedPassword,
      })
      .returning();
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    // Security: Hash password if it's being updated
    const secureUpdates = { ...updates };
    if (Object.prototype.hasOwnProperty.call(secureUpdates, "password")) {
      if (secureUpdates.password === null) {
        // allow explicit null if model permits
      } else if (typeof secureUpdates.password === "string") {
        secureUpdates.password = await bcrypt.hash(secureUpdates.password, 10);
      }
    }
    
    const [user] = await db
      .update(users)
      .set(secureUpdates)
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }

  // Task operations
  async getTask(id: string): Promise<Task | undefined> {
    const [task] = await db.select().from(tasks).where(eq(tasks.id, id));
    return task || undefined;
  }

  async getTasksByUserId(userId: string): Promise<Task[]> {
    return await db.select().from(tasks).where(eq(tasks.userId, userId));
  }

  async createTask(userId: string, insertTask: InsertTask): Promise<Task> {
    const [task] = await db
      .insert(tasks)
      .values({
        ...insertTask,
        userId,
      })
      .returning();
    return task;
  }

  async updateTask(id: string, updates: Partial<Task>): Promise<Task | undefined> {
    const [task] = await db
      .update(tasks)
      .set(updates)
      .where(eq(tasks.id, id))
      .returning();
    return task || undefined;
  }

  async deleteTask(id: string): Promise<boolean> {
    const rows = await db.delete(tasks).where(eq(tasks.id, id)).returning({ id: tasks.id });
    return Boolean(rows.length);
  }

  // Premium request operations
  async createPremiumRequest(insertRequest: InsertPremiumRequest): Promise<PremiumRequest> {
    const [request] = await db
      .insert(premiumRequests)
      .values(insertRequest)
      .returning();
    return request;
  }

  async updatePremiumRequest(id: string, updates: Partial<PremiumRequest>): Promise<PremiumRequest | undefined> {
    const [request] = await db
      .update(premiumRequests)
      .set(updates)
      .where(eq(premiumRequests.id, id))
      .returning();
    return request || undefined;
  }
}

export const storage = new DatabaseStorage();
