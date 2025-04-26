import { pgTable, text, serial, boolean, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password"),
  email: text("email"),
  isAuthenticated: boolean("is_authenticated").default(false),
  hasSubscription: boolean("has_subscription").default(false),
  subscriptionExpiryDate: timestamp("subscription_expiry_date"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Artifacts table
export const artifacts = pgTable("artifacts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(),
  origin: text("origin").notNull(),
  price: integer("price").notNull(),
  imagePath: text("image_path").notNull(),
  ipfsCid: text("ipfs_cid"),
  ipfsUrl: text("ipfs_url"),
  verificationHash: text("verification_hash").notNull(),
  metadataHash: text("metadata_hash"),
  isVerified: boolean("is_verified").default(false),
  verifiedAt: timestamp("verified_at"),
  userId: integer("user_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Subscriptions table
export const subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  planId: text("plan_id").notNull(),
  startDate: timestamp("start_date").notNull(),
  expiryDate: timestamp("expiry_date").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  isAuthenticated: true,
  hasSubscription: true,
  subscriptionExpiryDate: true,
});

export const insertArtifactSchema = createInsertSchema(artifacts).pick({
  name: true,
  description: true,
  type: true,
  origin: true,
  price: true,
  imagePath: true,
  ipfsCid: true,
  ipfsUrl: true,
  verificationHash: true,
  metadataHash: true,
  isVerified: true,
  userId: true,
  createdAt: true,
});

export const insertSubscriptionSchema = createInsertSchema(subscriptions).pick({
  userId: true,
  planId: true,
  startDate: true,
  expiryDate: true,
  isActive: true,
  createdAt: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertArtifact = z.infer<typeof insertArtifactSchema>;
export type Artifact = typeof artifacts.$inferSelect;

export type InsertSubscription = z.infer<typeof insertSubscriptionSchema>;
export type Subscription = typeof subscriptions.$inferSelect;
