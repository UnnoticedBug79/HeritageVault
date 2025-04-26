import { Express, Request, Response, Router } from "express";
import { storage } from "./storage";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import multer from "multer";
import { Server, createServer } from "http";
import { WebSocketServer } from "ws";
import { uploadToIPFS, generateVerificationHash } from "./ipfs";
import { log } from "./vite";

// Configure multer for file uploads
const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

// Generate random hash for demo purposes
function generateRandomHash(): string {
  return crypto.randomBytes(32).toString("hex");
}

export async function registerRoutes(app: Express): Promise<Server> {
  const router = Router();
  app.use("/api", router);

  // User routes
  router.get("/user", async (req: Request, res: Response) => {
    try {
      // Demo user for now
      const user = await storage.getUser(1);
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.post("/auth/login", async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      // Simple auth for demo
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      
      // Update auth status
      const updatedUser = await storage.updateUserAuthentication(user.id, true);
      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Direct IPFS upload endpoint
  router.post("/upload", upload.single('file'), async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      // Get uploaded file info
      const filePath = req.file.path;
      const originalName = req.file.originalname;
      
      // Extract metadata from request body
      const metadata = req.body;
      
      // Upload to IPFS
      const ipfsResult = await uploadToIPFS(filePath, originalName, metadata);
      
      // Return IPFS data
      res.json({
        success: true,
        cid: ipfsResult.cid,
        url: ipfsResult.url,
        metadataHash: ipfsResult.metadataHash
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Artifact routes
  router.get("/artifacts", async (_req: Request, res: Response) => {
    try {
      const artifacts = await storage.getArtifacts();
      res.json(artifacts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.get("/artifacts/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const artifact = await storage.getArtifact(id);
      if (!artifact) {
        return res.status(404).json({ error: "Artifact not found" });
      }
      res.json(artifact);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.post("/artifacts", upload.single('image'), async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No image uploaded" });
      }

      // Extract data from request
      const { name, description, type, origin, price, ipfsCid, ipfsUrl, metadataHash } = req.body;
      
      // Generate verification hash
      const metadata = { name, description, type, origin, price };
      const verificationHash = await generateVerificationHash(metadata, req.file.path);
      
      // Create artifact record
      const artifact = await storage.createArtifact({
        name,
        description,
        type,
        origin,
        price: parseInt(price),
        imagePath: req.file.path,
        ipfsCid: ipfsCid || '',
        ipfsUrl: ipfsUrl || '',
        verificationHash,
        metadataHash: metadataHash || '',
        isVerified: false,
        userId: 1, // Demo user ID
        createdAt: new Date()
      });
      
      res.status(201).json(artifact);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.post("/artifacts/:id/verify", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const artifact = await storage.getArtifact(id);
      if (!artifact) {
        return res.status(404).json({ error: "Artifact not found" });
      }
      
      // Verify artifact
      const verifiedArtifact = await storage.verifyArtifact(
        id, 
        artifact.verificationHash, 
        artifact.metadataHash
      );
      
      res.json(verifiedArtifact);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Subscription routes
  router.post("/subscription", async (req: Request, res: Response) => {
    try {
      const { planId, userId } = req.body;
      
      // Create subscription
      const subscription = await storage.createSubscription({
        userId: userId || 1,
        planId,
        startDate: new Date(),
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        isActive: true,
        createdAt: new Date()
      });
      
      // Update user subscription status
      await storage.updateUserSubscription(userId || 1, true, subscription.expiryDate);
      
      res.status(201).json(subscription);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);
  
  // Create WebSocket server
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  wss.on('connection', (ws) => {
    log('WebSocket client connected', 'ws');
    
    ws.on('message', (message) => {
      log(`Received message: ${message}`, 'ws');
      
      // Echo the message back
      if (ws.readyState === ws.OPEN) {
        ws.send(JSON.stringify({ type: 'echo', data: message.toString() }));
      }
    });
    
    ws.on('close', () => {
      log('WebSocket client disconnected', 'ws');
    });
  });
  
  return httpServer;
}
