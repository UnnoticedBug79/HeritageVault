import { User, InsertUser, Artifact, InsertArtifact, Subscription, InsertSubscription } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { users, artifacts, subscriptions } from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserAuthentication(id: number, isAuthenticated: boolean): Promise<User | undefined>;
  updateUserSubscription(id: number, hasSubscription: boolean, expiryDate?: Date): Promise<User | undefined>;
  
  // Artifact methods
  getArtifact(id: number): Promise<Artifact | undefined>;
  getArtifacts(): Promise<Artifact[]>;
  createArtifact(artifact: InsertArtifact): Promise<Artifact>;
  verifyArtifact(id: number, verificationHash: string, metadataHash: string): Promise<Artifact | undefined>;
  
  // Subscription methods
  createSubscription(subscription: InsertSubscription): Promise<Subscription>;
  getActiveSubscriptionByUserId(userId: number): Promise<Subscription | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUserAuthentication(id: number, isAuthenticated: boolean): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ isAuthenticated })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async updateUserSubscription(id: number, hasSubscription: boolean, expiryDate?: Date): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ 
        hasSubscription,
        subscriptionExpiryDate: expiryDate
      })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async getArtifact(id: number): Promise<Artifact | undefined> {
    const [artifact] = await db.select().from(artifacts).where(eq(artifacts.id, id));
    return artifact || undefined;
  }

  async getArtifacts(): Promise<Artifact[]> {
    return db.select().from(artifacts).orderBy(artifacts.createdAt);
  }

  async createArtifact(insertArtifact: InsertArtifact): Promise<Artifact> {
    const [artifact] = await db
      .insert(artifacts)
      .values(insertArtifact)
      .returning();
    return artifact;
  }

  async verifyArtifact(id: number, verificationHash: string, metadataHash: string): Promise<Artifact | undefined> {
    // For demo purposes, we'll accept any verification attempt
    const [artifact] = await db
      .update(artifacts)
      .set({ 
        isVerified: true,
        verifiedAt: new Date()
      })
      .where(eq(artifacts.id, id))
      .returning();
    return artifact;
  }

  async createSubscription(insertSubscription: InsertSubscription): Promise<Subscription> {
    const [subscription] = await db
      .insert(subscriptions)
      .values(insertSubscription)
      .returning();
    return subscription;
  }

  async getActiveSubscriptionByUserId(userId: number): Promise<Subscription | undefined> {
    const [subscription] = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, userId))
      .where(eq(subscriptions.isActive, true));
    return subscription || undefined;
  }
}

export const storage = new DatabaseStorage();
