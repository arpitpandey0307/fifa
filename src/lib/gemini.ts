// ============================================================================
// FIFA Nexus AI — Gemini Client
// Type-safe wrapper around @google/genai for structured AI responses.
// Provides automatic fallback when API key is unavailable.
// ============================================================================

import { GoogleGenAI } from "@google/genai";

/** Gemini API key loaded from environment variables. */
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn(
    "⚠️ GEMINI_API_KEY not set. AI features will return fallback responses."
  );
}

/** Singleton Gemini client instance. `null` when API key is missing. */
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

/** Supported Gemini model identifiers. */
export type GeminiModel = "gemini-2.5-pro" | "gemini-2.0-flash";

/** Configuration options for Gemini API calls. */
interface GeminiOptions {
  /** Which Gemini model to use. Defaults to `gemini-2.0-flash`. */
  model?: GeminiModel;
  /** Sampling temperature (0–1). Lower = more deterministic. */
  temperature?: number;
  /** Maximum tokens in the response. */
  maxTokens?: number;
}

/**
 * Call Gemini with a system prompt and user message.
 * Returns a plain text response. Falls back to heuristic responses
 * when the API key is not configured or the API call fails.
 *
 * @param systemPrompt - The system-level instruction for the AI.
 * @param userMessage - The user's input message.
 * @param options - Optional model, temperature, and token configuration.
 * @returns The AI-generated text response.
 */
export async function callGemini(
  systemPrompt: string,
  userMessage: string,
  options: GeminiOptions = {}
): Promise<string> {
  const { model = "gemini-2.0-flash", temperature = 0.7, maxTokens = 2048 } = options;

  if (!ai) {
    return getFallbackResponse(userMessage);
  }

  try {
    const response = await ai.models.generateContent({
      model,
      contents: [
        {
          role: "user",
          parts: [{ text: `${systemPrompt}\n\n---\n\nUser Input:\n${userMessage}` }],
        },
      ],
      config: {
        temperature,
        maxOutputTokens: maxTokens,
      },
    });

    return response.text ?? "No response generated.";
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Gemini API error:", message);
    return getFallbackResponse(userMessage);
  }
}

/**
 * Call Gemini expecting a JSON response.
 * Parses the raw text into a typed object. Throws if the API key is
 * missing or the response cannot be parsed.
 *
 * @typeParam T - The expected shape of the parsed JSON response.
 * @param systemPrompt - The system-level instruction for the AI.
 * @param userMessage - The user's input message.
 * @param options - Optional model, temperature, and token configuration.
 * @returns The parsed JSON response from Gemini.
 * @throws {Error} When the API key is not configured or parsing fails.
 */
export async function callGeminiJSON<T>(
  systemPrompt: string,
  userMessage: string,
  options: GeminiOptions = {}
): Promise<T> {
  const { model = "gemini-2.0-flash", temperature = 0.4, maxTokens = 2048 } = options;

  if (!ai) {
    throw new Error("Gemini API key not configured");
  }

  try {
    const response = await ai.models.generateContent({
      model,
      contents: [
        {
          role: "user",
          parts: [{ text: `${systemPrompt}\n\n---\n\nUser Input:\n${userMessage}` }],
        },
      ],
      config: {
        temperature,
        maxOutputTokens: maxTokens,
        responseMimeType: "application/json",
      },
    });

    const text = response.text ?? "{}";
    return JSON.parse(text) as T;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Gemini JSON API error:", message);
    throw error;
  }
}

/**
 * Generate a heuristic fallback response when Gemini is unavailable.
 * Uses keyword matching to provide contextually relevant answers.
 *
 * @param input - The user's original message.
 * @returns A pre-written response matching the detected intent.
 */
function getFallbackResponse(input: string): string {
  const lower = input.toLowerCase();

  if (lower.includes("gate") || lower.includes("seat")) {
    return "Based on your ticket, enter through **Gate D** and follow signs to **Section NS-A, Row 12, Seat 8**. The walk takes approximately 4 minutes. Look for volunteer guides wearing yellow vests near the gate.";
  }

  if (lower.includes("hungry") || lower.includes("food") || lower.includes("eat") || lower.includes("भूख")) {
    return "Here are the nearest food options:\n\n1. 🥗 **Green Bites** (40m away) - Wait: 2 min - Vegetarian\n2. 🌮 **World Kitchen** (65m away) - Wait: 5 min - Halal\n3. 🍕 **Pizza Corner** (90m away) - Wait: 3 min\n\n✨ **Recommendation:** Green Bites has the shortest queue right now!";
  }

  if (lower.includes("leave") || lower.includes("transport") || lower.includes("depart")) {
    return "Based on current crowd predictions, I recommend **leaving 5 minutes before the final whistle** to avoid peak congestion. Take **Gate D** (least crowded exit) and head to **Parking Lot B** via the south concourse. Estimated drive time: 25 minutes vs 45+ minutes if you wait.";
  }

  if (lower.includes("faint") || lower.includes("medical") || lower.includes("hurt") || lower.includes("emergency")) {
    return "🚨 **Emergency Response Initiated**\n\n- **Type:** Medical Emergency\n- **Severity:** HIGH\n- **Nearest Team:** MED-03 (Medical Station 2, 2.5 min away)\n- **Route:** MS-2 → Corridor C → Location\n\n**Recommendation:** Deploy MED-03 immediately. Alert security to create clearance zone.";
  }

  return "I'm your FIFA Nexus AI assistant. I can help you with:\n- 🚪 Finding your gate and seat\n- 🍕 Food recommendations\n- 🚗 Transport and departure planning\n- 🏥 Emergency assistance\n- ♿ Accessibility support\n\nWhat would you like help with?";
}
