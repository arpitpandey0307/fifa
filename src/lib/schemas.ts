// ============================================================================
// FIFA Nexus AI — Zod Validation Schemas
// Input validation for all API routes. Security-first approach.
// Every API endpoint validates input BEFORE processing to prevent
// injection attacks, oversized payloads, and malformed requests.
// ============================================================================

import { z } from "zod";

/**
 * Validation schema for the Fan AI Assistant chat endpoint (`/api/ai/chat`).
 *
 * - `message`: Required, 1–2000 characters, auto-trimmed
 * - `context`: Optional fan profile with defaults for demonstration mode
 *
 * @example
 * ```ts
 * const parsed = chatRequestSchema.safeParse({
 *   message: "Where is my gate?",
 *   context: { seat: "NS-A-R12-S8", language: "en" }
 * });
 * ```
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

/** Inferred TypeScript type from chatRequestSchema. */
export type ChatRequest = z.infer<typeof chatRequestSchema>;

/**
 * Validation schema for the Incident Commander endpoint (`/api/ai/incident`).
 *
 * - `description`: Required, 5–1000 characters, auto-trimmed
 * - `reporterLocation`: Optional GPS coordinates with range validation
 *
 * @example
 * ```ts
 * const parsed = incidentRequestSchema.safeParse({
 *   description: "Someone fainted near Gate B",
 *   reporterLocation: { lat: 40.8128, lng: -74.0742 }
 * });
 * ```
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

/** Inferred TypeScript type from incidentRequestSchema. */
export type IncidentRequest = z.infer<typeof incidentRequestSchema>;

/**
 * Validation schema for the Crowd Prediction endpoint (`/api/ai/predict`).
 *
 * - `zoneIds`: Array of zone codes (1–20), defaults to empty (all zones)
 */
export const predictionRequestSchema = z.object({
  zoneIds: z
    .array(z.string())
    .min(1)
    .max(20)
    .optional()
    .default([]),
});

/** Inferred TypeScript type from predictionRequestSchema. */
export type PredictionRequest = z.infer<typeof predictionRequestSchema>;

/**
 * Validation schema for Transport route requests.
 *
 * - `originZone`: Starting zone code (default: "NS-A")
 * - `accessibility`: Accessibility requirements (default: "none")
 * - `preference`: Route optimization strategy (fastest, least_crowded, cheapest)
 */
export const transportRequestSchema = z.object({
  originZone: z.string().optional().default("NS-A"),
  accessibility: z.string().optional().default("none"),
  preference: z.enum(["fastest", "least_crowded", "cheapest"]).optional().default("fastest"),
});

/** Inferred TypeScript type from transportRequestSchema. */
export type TransportRequest = z.infer<typeof transportRequestSchema>;

/**
 * Validation schema for user settings updates.
 * All fields are optional to support partial updates.
 *
 * - `role`: One of the 7 supported user roles
 * - `language`: ISO 639-1 language code (2–5 characters)
 * - Accessibility toggles: boolean flags for each feature
 */
export const settingsSchema = z.object({
  role: z.enum(["fan", "volunteer", "security", "manager", "transport", "medical", "vendor"]).optional(),
  language: z.string().min(2).max(5).optional(),
  accessibilityMode: z.boolean().optional(),
  highContrast: z.boolean().optional(),
  reducedMotion: z.boolean().optional(),
  notifications: z.boolean().optional(),
});

/** Inferred TypeScript type from settingsSchema. */
export type SettingsUpdate = z.infer<typeof settingsSchema>;
