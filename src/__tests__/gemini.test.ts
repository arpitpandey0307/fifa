// ============================================================================
// FIFA Nexus AI — Gemini Client Tests
// Tests for the AI client wrapper with fallback handling.
// ============================================================================

import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the @google/genai module before importing gemini
vi.mock("@google/genai", () => ({
  GoogleGenAI: class {
    models = {
      generateContent: vi.fn().mockResolvedValue({
        text: "Mock Gemini response",
      }),
    };
  },
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

    it("parses and returns JSON on success", async () => {
      process.env.GEMINI_API_KEY = "test-key";
      vi.doMock("@google/genai", () => ({
        GoogleGenAI: class {
          models = {
            generateContent: vi.fn().mockResolvedValue({
              text: '{"status":"ok"}',
            }),
          };
        },
      }));

      const { callGeminiJSON } = await import("@/lib/gemini");
      const result = await callGeminiJSON("sys", "user");
      expect(result).toEqual({ status: "ok" });
    });

    it("handles generateContent throwing an error", async () => {
      process.env.GEMINI_API_KEY = "test-key";
      vi.doMock("@google/genai", () => ({
        GoogleGenAI: class {
          models = {
            generateContent: vi.fn().mockRejectedValue(new Error("API Error")),
          };
        },
      }));

      const { callGeminiJSON } = await import("@/lib/gemini");
      await expect(callGeminiJSON("sys", "user")).rejects.toThrow("API Error");
    });
  });

  describe("callGemini success", () => {
    it("returns text response on success", async () => {
      process.env.GEMINI_API_KEY = "test-key";
      vi.doMock("@google/genai", () => ({
        GoogleGenAI: class {
          models = {
            generateContent: vi.fn().mockResolvedValue({
              text: "Success response",
            }),
          };
        },
      }));

      const { callGemini } = await import("@/lib/gemini");
      const result = await callGemini("sys", "user");
      expect(result).toBe("Success response");
    });
    
    it("handles generateContent throwing an error in callGemini", async () => {
      process.env.GEMINI_API_KEY = "test-key";
      vi.doMock("@google/genai", () => ({
        GoogleGenAI: class {
          models = {
            generateContent: vi.fn().mockRejectedValue(new Error("Text API Error")),
          };
        },
      }));

      const { callGemini } = await import("@/lib/gemini");
      // callGemini catches errors and returns a fallback when API fails
      const result = await callGemini("sys", "user");
      expect(result).toContain("FIFA Nexus AI"); // generic fallback
    });
  });
});
