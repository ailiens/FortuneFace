import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import path from "path";
import { storage } from "./storage";
import { insertAnalysisSchema } from "@shared/schema";
import { z } from "zod";

const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Upload and analyze face image
  app.post("/api/analyze-face", upload.single('image'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No image file provided" });
      }

      const { gender } = req.body;
      
      // Validate gender if provided
      if (gender && !['male', 'female'].includes(gender)) {
        return res.status(400).json({ message: "Invalid gender value" });
      }

      // In a real implementation, you would:
      // 1. Process the uploaded image
      // 2. Run face detection and landmark extraction
      // 3. Apply physiognomy analysis rules
      // For now, we'll return the file path for the frontend to process
      
      const imageUrl = `/uploads/${req.file.filename}`;
      
      res.json({
        success: true,
        imageUrl,
        message: "Image uploaded successfully. Process on frontend with face-api.js"
      });

    } catch (error) {
      console.error('Face analysis error:', error);
      res.status(500).json({ 
        message: "Face analysis failed", 
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Save analysis results
  app.post("/api/save-analysis", async (req, res) => {
    try {
      const validatedData = insertAnalysisSchema.parse(req.body);
      const analysis = await storage.createAnalysis(validatedData);
      
      res.json({
        success: true,
        analysisId: analysis.id,
        message: "Analysis saved successfully"
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid analysis data", 
          errors: error.errors 
        });
      }
      
      console.error('Save analysis error:', error);
      res.status(500).json({ 
        message: "Failed to save analysis",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Get analysis by ID
  app.get("/api/analysis/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid analysis ID" });
      }

      const analysis = await storage.getAnalysis(id);
      if (!analysis) {
        return res.status(404).json({ message: "Analysis not found" });
      }

      res.json(analysis);
    } catch (error) {
      console.error('Get analysis error:', error);
      res.status(500).json({ 
        message: "Failed to retrieve analysis",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Serve uploaded images
  app.use('/uploads', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
  });

  const httpServer = createServer(app);
  return httpServer;
}
