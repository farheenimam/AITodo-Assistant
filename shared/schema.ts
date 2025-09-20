import { sql } from "drizzle-orm";
import { pgTable, text, varchar, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password"),
  googleId: text("google_id"),
  isPremium: boolean("is_premium").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const tasks = pgTable("tasks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  deadline: timestamp("deadline"),
  priority: text("priority", { enum: ["High", "Medium", "Low"] }).default("Medium").notNull(),
  status: text("status", { enum: ["Incomplete", "Complete"] }).default("Incomplete").notNull(),
  aiSuggestion: text("ai_suggestion"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const premiumRequests = pgTable("premium_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  solanaTxId: text("solana_tx_id"),
  status: text("status", { enum: ["Pending", "Confirmed", "Failed"] }).default("Pending").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  name: true,
  email: true,
  password: true,
  googleId: true,
});

export const insertTaskSchema = createInsertSchema(tasks).pick({
  title: true,
  description: true,
  deadline: true,
  priority: true,
  status: true,
  aiSuggestion: true,
}).extend({
  deadline: z.union([
    z.string().transform((str) => new Date(str)),
    z.date(),
    z.null(),
    z.undefined()
  ]).optional(),
});

export const insertPremiumRequestSchema = createInsertSchema(premiumRequests).pick({
  userId: true,
  solanaTxId: true,
  status: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertTask = z.infer<typeof insertTaskSchema>;
export type Task = typeof tasks.$inferSelect;
export type InsertPremiumRequest = z.infer<typeof insertPremiumRequestSchema>;
export type PremiumRequest = typeof premiumRequests.$inferSelect;
