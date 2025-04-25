import { users, type User, type InsertUser, artifacts, type Artifact, type InsertArtifact, subscriptions, type Subscription, type InsertSubscription } from "@shared/schema";

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

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private artifacts: Map<number, Artifact>;
  private subscriptions: Map<number, Subscription>;
  private userIdCounter: number;
  private artifactIdCounter: number;
  private subscriptionIdCounter: number;

  constructor() {
    this.users = new Map();
    this.artifacts = new Map();
    this.subscriptions = new Map();
    this.userIdCounter = 0;
    this.artifactIdCounter = 0;
    this.subscriptionIdCounter = 0;
    
    // Add demo user
    this.createUser({
      username: 'demo_user',
      password: 'password',
      isAuthenticated: false,
      hasSubscription: false
    });
    
    // Add demo artifacts
    this.createArtifact({
      name: 'Batik Mega Mendung',
      description: 'Batik tradisional dari Cirebon dengan motif awan yang khas. Motif ini melambangkan kehidupan dan keberkahan.',
      type: 'batik',
      origin: 'Cirebon',
      price: 1500000,
      imageUrl: 'https://placehold.co/600x600/1a1a2e/00e5ff?text=Batik+Mega+Mendung',
      ownerId: 1,
    });
    
    this.createArtifact({
      name: 'Tenun Ikat Sumba',
      description: 'Kain tenun tradisional dari Sumba dengan warna-warna alami dan motif geometris yang memiliki makna simbolis.',
      type: 'tenun',
      origin: 'Sumba',
      price: 2000000,
      imageUrl: 'https://placehold.co/600x600/1a1a2e/00e5ff?text=Tenun+Ikat+Sumba',
      ownerId: 1,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    for (const user of this.users.values()) {
      if (user.username === username) {
        return user;
      }
    }
    return undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = ++this.userIdCounter;
    
    const user: User = { 
      id, 
      ...insertUser,
      createdAt: new Date()
    };
    
    this.users.set(id, user);
    return user;
  }

  async updateUserAuthentication(id: number, isAuthenticated: boolean): Promise<User | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, isAuthenticated };
    this.users.set(id, updatedUser);
    
    return updatedUser;
  }

  async updateUserSubscription(id: number, hasSubscription: boolean, expiryDate?: Date): Promise<User | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;
    
    const updatedUser = { 
      ...user, 
      hasSubscription,
      subscriptionExpiryDate: expiryDate
    };
    
    this.users.set(id, updatedUser);
    
    return updatedUser;
  }

  async getArtifact(id: number): Promise<Artifact | undefined> {
    return this.artifacts.get(id);
  }

  async getArtifacts(): Promise<Artifact[]> {
    return Array.from(this.artifacts.values());
  }

  async createArtifact(insertArtifact: InsertArtifact): Promise<Artifact> {
    const id = ++this.artifactIdCounter;
    
    const artifact: Artifact = {
      id,
      ...insertArtifact,
      verified: false,
      createdAt: new Date(),
    };
    
    this.artifacts.set(id, artifact);
    return artifact;
  }

  async verifyArtifact(id: number, verificationHash: string, metadataHash: string): Promise<Artifact | undefined> {
    const artifact = await this.getArtifact(id);
    if (!artifact) return undefined;
    
    const updatedArtifact = {
      ...artifact,
      verified: true,
      verificationHash,
      metadataHash
    };
    
    this.artifacts.set(id, updatedArtifact);
    return updatedArtifact;
  }

  async createSubscription(insertSubscription: InsertSubscription): Promise<Subscription> {
    const id = ++this.subscriptionIdCounter;
    
    const subscription: Subscription = {
      id,
      ...insertSubscription,
      active: true,
      createdAt: new Date(),
    };
    
    this.subscriptions.set(id, subscription);
    return subscription;
  }

  async getActiveSubscriptionByUserId(userId: number): Promise<Subscription | undefined> {
    for (const subscription of this.subscriptions.values()) {
      if (subscription.userId === userId && subscription.active) {
        return subscription;
      }
    }
    return undefined;
  }
}

export const storage = new MemStorage();
