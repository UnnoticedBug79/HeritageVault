import { pgTable, serial, text, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull(),
  password: text("password").notNull(),
  isAuthenticated: boolean("is_authenticated").default(false),
  hasSubscription: boolean("has_subscription").default(false),
  subscriptionExpiryDate: timestamp("subscription_expiry_date"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const artifacts = pgTable("artifacts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(),
  origin: text("origin").notNull(),
  price: integer("price").notNull(),
  imageUrl: text("image_url").notNull(),
  ownerId: integer("owner_id").references(() => users.id),
  nftTokenId: text("nft_token_id"),
  verified: boolean("verified").default(false),
  verificationHash: text("verification_hash"),
  metadataHash: text("metadata_hash"),
  metadata: json("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  startDate: timestamp("start_date").defaultNow().notNull(),
  endDate: timestamp("end_date").notNull(),
  plan: text("plan").notNull(),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertArtifactSchema = createInsertSchema(artifacts).pick({
  name: true,
  description: true,
  type: true,
  origin: true,
  price: true,
  imageUrl: true,
  ownerId: true,
});

export const insertSubscriptionSchema = createInsertSchema(subscriptions).pick({
  userId: true,
  endDate: true,
  plan: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertArtifact = z.infer<typeof insertArtifactSchema>;
export type Artifact = typeof artifacts.$inferSelect;

export type InsertSubscription = z.infer<typeof insertSubscriptionSchema>;
export type Subscription = typeof subscriptions.$inferSelect;
