import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const analyses = pgTable("analyses", {
  id: serial("id").primaryKey(),
  imageUrl: text("image_url").notNull(),
  gender: text("gender"), // 'male' | 'female' | null
  facialLandmarks: jsonb("facial_landmarks").notNull(),
  analysisResults: jsonb("analysis_results").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertAnalysisSchema = createInsertSchema(analyses).omit({
  id: true,
  createdAt: true,
});

export type InsertAnalysis = z.infer<typeof insertAnalysisSchema>;
export type Analysis = typeof analyses.$inferSelect;

// Face analysis types
export interface FacialLandmarks {
  forehead: { x: number; y: number }[];
  eyes: { left: { x: number; y: number }[]; right: { x: number; y: number }[] };
  nose: { x: number; y: number }[];
  mouth: { x: number; y: number }[];
  chin: { x: number; y: number }[];
  jawline: { x: number; y: number }[];
}

export interface FeatureAnalysis {
  feature: string;
  score: number;
  interpretation: string;
  meaning: string;
  traits: string[];
  measurements: {
    width?: number;
    height?: number;
    ratio?: number;
    angle?: number;
    distance?: number;
  };
  detailedAnalysis: string;
}

export interface AnimalFaceAnalysis {
  primaryAnimal: string;
  percentage: number;
  characteristics: string[];
  description: string;
  secondaryAnimals: Array<{
    animal: string;
    percentage: number;
    reason: string;
  }>;
}

export interface PhysiognomyResults {
  overall: {
    balance: number;
    harmony: number;
    summary: string;
  };
  features: FeatureAnalysis[];
  recommendations: string[];
  animalFace: AnimalFaceAnalysis;
  detailedMeasurements: {
    faceRatio: number;
    eyeDistance: number;
    noseToMouthRatio: number;
    jawlineAngle: number;
    facialSymmetry: number;
  };
}
