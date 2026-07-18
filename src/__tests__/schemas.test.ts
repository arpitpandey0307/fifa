// ============================================================================
// FIFA Nexus AI — Zod Schema Validation Tests
// ============================================================================

import { describe, it, expect } from "vitest";
import {
  chatRequestSchema,
  incidentRequestSchema,
  predictionRequestSchema,
  settingsSchema,
} from "@/lib/schemas";

describe("chatRequestSchema", () => {
  it("accepts valid chat messages", () => {
    const result = chatRequestSchema.safeParse({
      message: "Where is my gate?",
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty messages", () => {
    const result = chatRequestSchema.safeParse({ message: "" });
    expect(result.success).toBe(false);
  });

  it("rejects messages exceeding 2000 characters", () => {
    const result = chatRequestSchema.safeParse({
      message: "a".repeat(2001),
    });
    expect(result.success).toBe(false);
  });

  it("trims whitespace from messages", () => {
    const result = chatRequestSchema.safeParse({
      message: "  hello  ",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.message).toBe("hello");
    }
  });

  it("provides default context when none given", () => {
    const result = chatRequestSchema.safeParse({
      message: "Where is food?",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.context.seat).toBe("NS-A-R12-S8");
      expect(result.data.context.language).toBe("en");
    }
  });

  it("accepts custom context", () => {
    const result = chatRequestSchema.safeParse({
      message: "Help",
      context: {
        seat: "SS-B-R5-S12",
        gate: "Gate A",
        zone: "SS-B",
        language: "es",
        dietary: ["vegetarian"],
        accessibility: "wheelchair",
        transportPreference: "bus",
      },
    });
    expect(result.success).toBe(true);
  });
});

describe("incidentRequestSchema", () => {
  it("accepts valid incident descriptions", () => {
    const result = incidentRequestSchema.safeParse({
      description: "Someone fainted near Gate B",
    });
    expect(result.success).toBe(true);
  });

  it("rejects descriptions under 5 characters", () => {
    const result = incidentRequestSchema.safeParse({
      description: "hi",
    });
    expect(result.success).toBe(false);
  });

  it("rejects descriptions over 1000 characters", () => {
    const result = incidentRequestSchema.safeParse({
      description: "a".repeat(1001),
    });
    expect(result.success).toBe(false);
  });

  it("accepts optional reporter location", () => {
    const result = incidentRequestSchema.safeParse({
      description: "Suspicious package found",
      reporterLocation: { lat: 40.8135, lng: -74.0745 },
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid coordinates", () => {
    const result = incidentRequestSchema.safeParse({
      description: "Something happened",
      reporterLocation: { lat: 200, lng: -300 },
    });
    expect(result.success).toBe(false);
  });
});

describe("predictionRequestSchema", () => {
  it("defaults to empty array when zoneIds is not provided", () => {
    const result = predictionRequestSchema.safeParse({});
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.zoneIds).toEqual([]);
    }
  });

  it("accepts valid zone IDs", () => {
    const result = predictionRequestSchema.safeParse({
      zoneIds: ["NS-A", "NS-B", "SS-A"],
    });
    expect(result.success).toBe(true);
  });

  it("rejects more than 20 zone IDs", () => {
    const result = predictionRequestSchema.safeParse({
      zoneIds: Array.from({ length: 21 }, (_, i) => `zone-${i}`),
    });
    expect(result.success).toBe(false);
  });
});

describe("settingsSchema", () => {
  it("accepts valid settings", () => {
    const result = settingsSchema.safeParse({
      role: "fan",
      language: "hi",
      accessibilityMode: true,
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid roles", () => {
    const result = settingsSchema.safeParse({
      role: "hacker",
    });
    expect(result.success).toBe(false);
  });

  it("accepts partial updates", () => {
    const result = settingsSchema.safeParse({
      notifications: false,
    });
    expect(result.success).toBe(true);
  });
});
