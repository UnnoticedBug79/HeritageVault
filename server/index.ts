import express, { NextFunction, Request, Response } from "express";
import session from "express-session";
import { registerRoutes } from "./routes";
import { serveStatic, setupVite, log } from "./vite";
import path from "path";

async function createServer() {
  const app = express();
  const root = process.cwd();
  
  // Session middleware
  app.use(session({
    secret: process.env.SESSION_SECRET || 'heritage-vault-secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV === 'production' }
  }));
  
  // JSON body parser
  app.use(express.json());
  
  // Static file serving
  app.use('/uploads', express.static(path.join(root, 'uploads')));
  
  // Register API routes
  const server = await registerRoutes(app);
  
  // Error handler
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: err.message });
  });
  
  // Setup Vite dev server or serve static files based on environment
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  
  // Start server
  const port = process.env.PORT || 5000;
  server.listen(port, () => {
    log(`serving on port ${port}`);
  });
}

createServer();
