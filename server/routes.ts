import { Express, Request, Response, Router } from "express";
import { createServer, Server } from "http";
import { storage } from "./storage";

function generateRandomHash(): string {
  const characters = "0123456789abcdef";
  let result = "";
  for (let i = 0; i < 64; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

export async function registerRoutes(app: Express): Promise<Server> {
  const router = Router();

  router.get("/user", async (req: Request, res: Response) => {
    try {
      // Mock user data for demo
      const user = await storage.getUser(1);
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  router.post("/auth/login", async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      
      let user = await storage.getUserByUsername(username);
      
      if (!user) {
        // Create a new user if it doesn't exist (for demo purposes)
        user = await storage.createUser({
          username,
          password,
          isAuthenticated: false,
          hasSubscription: false
        });
      }
      
      // In a real app, we'd check password hash
      // For demo, we'll just authenticate the user
      user = await storage.updateUserAuthentication(user.id, true);
      
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to login" });
    }
  });

  router.get("/artifacts", async (_req: Request, res: Response) => {
    try {
      const artifacts = await storage.getArtifacts();
      res.json(artifacts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch artifacts" });
    }
  });

  router.get("/artifacts/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid artifact ID" });
      }
      
      const artifact = await storage.getArtifact(id);
      if (!artifact) {
        return res.status(404).json({ message: "Artifact not found" });
      }
      
      res.json(artifact);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch artifact" });
    }
  });

  router.post("/artifacts", async (req: Request, res: Response) => {
    try {
      // In a real app, we'd handle file upload and store in cloud storage
      // For demo, we'll just use mock data
      const { name, description, type, origin, price } = req.body;
      
      const artifact = await storage.createArtifact({
        name,
        description,
        type,
        origin,
        price: parseInt(price),
        imageUrl: `https://placehold.co/600x600/1a1a2e/00e5ff?text=${name}`,
        ownerId: 1, // Mock user ID
      });
      
      res.status(201).json(artifact);
    } catch (error) {
      res.status(500).json({ message: "Failed to create artifact" });
    }
  });

  router.post("/artifacts/:id/verify", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid artifact ID" });
      }
      
      const artifact = await storage.getArtifact(id);
      if (!artifact) {
        return res.status(404).json({ message: "Artifact not found" });
      }
      
      // In a real app, we would perform real verification logic
      // For this demo, we'll assume verification is successful
      const verificationHash = req.body.verificationHash || generateRandomHash();
      const metadataHash = req.body.metadataHash || generateRandomHash();
      
      const verifiedArtifact = await storage.verifyArtifact(id, verificationHash, metadataHash);
      
      res.json({
        ...verifiedArtifact,
        verified: true,
        message: "Artifact successfully verified"
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to verify artifact" });
    }
  });

  router.post("/subscription", async (req: Request, res: Response) => {
    try {
      const { plan, months = 1 } = req.body;
      
      // Mock subscription
      const user = await storage.getUser(1);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + months);
      
      await storage.updateUserSubscription(user.id, true, endDate);
      
      const subscription = await storage.createSubscription({
        userId: user.id,
        plan,
        endDate,
      });
      
      res.json(subscription);
    } catch (error) {
      res.status(500).json({ message: "Failed to create subscription" });
    }
  });

  app.use("/api", router);
  
  const httpServer = createServer(app);
  return httpServer;
    }
