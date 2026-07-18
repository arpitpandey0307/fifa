// ============================================================================
// FIFA Nexus AI — Gemini Client Tests
// Tests for the AI client wrapper with fallback handling.
// ============================================================================

import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the @google/genai module before importing gemini
vi.mock("@google/genai", () => ({
  GoogleGenAI: vi.fn().mockImplementation(() => ({
    models: {
      generateContent: vi.fn().mockResolvedValue({
        text: "Mock Gemini response",
      }),
    },
  })),
}));

describe("Gemini Client", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  describe("callGemini", () => {
    it("returns fallback response when API key is not set", async () => {
      // Clear the API key
      const originalKey = process.env.GEMINI_API_KEY;
      delete process.env.GEMINI_API_KEY;

      // Re-import to pick up missing key
      const { callGemini } = await import("@/lib/gemini");
      const result = await callGemini("system prompt", "where is my gate?");

      expect(result).toBeTruthy();
      expect(typeof result).toBe("string");
      expect(result.length).toBeGreaterThan(0);

      // Restore
      if (originalKey) process.env.GEMINI_API_KEY = originalKey;
    });

    it("returns food fallback for food-related queries", async () => {
      delete process.env.GEMINI_API_KEY;
      const { callGemini } = await import("@/lib/gemini");

      const result = await callGemini("system", "I'm hungry, where is food?");
      expect(result).toContain("food");
    });

    it("returns transport fallback for departure queries", async () => {
      delete process.env.GEMINI_API_KEY;
      const { callGemini } = await import("@/lib/gemini");

      const result = await callGemini("system", "when should I leave?");
      expect(result).toContain("leaving");
    });

    it("returns emergency fallback for medical queries", async () => {
      delete process.env.GEMINI_API_KEY;
      const { callGemini } = await import("@/lib/gemini");

      const result = await callGemini("system", "someone fainted here");
      expect(result).toContain("Emergency");
    });

    it("returns generic fallback for unknown queries", async () => {
      delete process.env.GEMINI_API_KEY;
      const { callGemini } = await import("@/lib/gemini");

      const result = await callGemini("system", "random question");
      expect(result).toContain("FIFA Nexus AI");
    });
  });

  describe("callGeminiJSON", () => {
    it("throws when API key is not set", async () => {
      delete process.env.GEMINI_API_KEY;
      const { callGeminiJSON } = await import("@/lib/gemini");

      await expect(
        callGeminiJSON("system", "test")
      ).rejects.toThrow("Gemini API key not configured");
    });
  });
});
