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
  
  // User routes
  router.get("/user", async (req: Request, res: Response) => {
    try {
      // Untuk demo, selalu kembalikan user dengan ID 1
      const user = await storage.getUser(1);
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
  
  router.post("/auth/login", async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      
      if (user.password !== password) {
        return res.status(401).json({ message: "Invalid password" });
      }
      
      const authenticatedUser = await storage.updateUserAuthentication(user.id, true);
      
      res.json(authenticatedUser);
    } catch (error) {
      res.status(500).json({ message: "Login failed" });
    }
  });
  
  // Artifact routes
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
      // Untuk demo, selalu gunakan ownerID 1 (demo user)
      const artifactData = {
        ...req.body,
        ownerId: 1,
        // Untuk demo, gunakan URL gambar placeholder jika tidak ada
        imageUrl: req.body.imageUrl || '/assets/artifact-placeholder.jpg',
      };
      
      const artifact = await storage.createArtifact(artifactData);
      
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
      
      // Untuk demo, gunakan hash yang disediakan atau generate random hash
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
  
  // Subscription routes
  router.post("/subscription", async (req: Request, res: Response) => {
    try {
      const { plan, months = 1 } = req.body;
      
      // Untuk demo, selalu gunakan userId 1 (demo user)
      const userId = 1;
      
      // Tentukan tanggal berakhir berdasarkan jumlah bulan
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + months);
      
      const subscription = await storage.createSubscription({
        userId,
        plan,
        endDate,
      });
      
      res.status(201).json(subscription);
    } catch (error) {
      res.status(500).json({ message: "Failed to create subscription" });
    }
  });
  
  app.use("/api", router);
  
  const httpServer = createServer(app);
  return httpServer;
}
