// ============================================================================
// FIFA Nexus AI — Zod Validation Schemas
// Input validation for all API routes. Security-first approach.
// ============================================================================

import { z } from "zod";

/**
 * Fan assistant chat request validation.
 */
export const chatRequestSchema = z.object({
  message: z
    .string()
    .min(1, "Message is required")
    .max(2000, "Message too long")
    .transform((s) => s.trim()),
  context: z
    .object({
      seat: z.string().default("NS-A-R12-S8"),
      gate: z.string().default("Gate D"),
      zone: z.string().default("NS-A"),
      language: z.string().default("en"),
      dietary: z.array(z.string()).default([]),
      accessibility: z.string().default("none"),
      transportPreference: z.string().default("metro"),
    })
    .optional()
    .default(() => ({
      seat: "NS-A-R12-S8",
      gate: "Gate D",
      zone: "NS-A",
      language: "en",
      dietary: [],
      accessibility: "none",
      transportPreference: "metro",
    })),
});

export type ChatRequest = z.infer<typeof chatRequestSchema>;

/**
 * Incident report request validation.
 */
export const incidentRequestSchema = z.object({
  description: z
    .string()
    .min(5, "Description must be at least 5 characters")
    .max(1000, "Description too long")
    .transform((s) => s.trim()),
  reporterLocation: z
    .object({
      lat: z.number().min(-90).max(90).optional(),
      lng: z.number().min(-180).max(180).optional(),
    })
    .optional(),
});

export type IncidentRequest = z.infer<typeof incidentRequestSchema>;

/**
 * Crowd prediction request validation.
 */
export const predictionRequestSchema = z.object({
  zoneIds: z
    .array(z.string())
    .min(1)
    .max(20)
    .optional()
    .default([]),
});

export type PredictionRequest = z.infer<typeof predictionRequestSchema>;

/**
 * Transport route request validation.
 */
export const transportRequestSchema = z.object({
  originZone: z.string().optional().default("NS-A"),
  accessibility: z.string().optional().default("none"),
  preference: z.enum(["fastest", "least_crowded", "cheapest"]).optional().default("fastest"),
});

export type TransportRequest = z.infer<typeof transportRequestSchema>;

/**
 * Settings update validation.
 */
export const settingsSchema = z.object({
  role: z.enum(["fan", "volunteer", "security", "manager", "transport", "medical", "vendor"]).optional(),
  language: z.string().min(2).max(5).optional(),
  accessibilityMode: z.boolean().optional(),
  highContrast: z.boolean().optional(),
  reducedMotion: z.boolean().optional(),
  notifications: z.boolean().optional(),
});

export type SettingsUpdate = z.infer<typeof settingsSchema>;
