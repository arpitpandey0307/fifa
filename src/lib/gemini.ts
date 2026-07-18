// ============================================================================
// FIFA Nexus AI — Gemini Client
// Wrapper around @google/genai for structured AI responses.
// ============================================================================

import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn(
    "⚠️ GEMINI_API_KEY not set. AI features will return fallback responses."
  );
}

const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export type GeminiModel = "gemini-2.5-pro" | "gemini-2.0-flash";

interface GeminiOptions {
  model?: GeminiModel;
  temperature?: number;
  maxTokens?: number;
}

/**
 * Call Gemini with a system prompt and user message.
 * Returns the text response.
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
  } catch (error) {
    console.error("Gemini API error:", error);
    return getFallbackResponse(userMessage);
  }
}

/**
 * Call Gemini expecting a JSON response.
 * Parses the response and returns the parsed object.
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
  } catch (error) {
    console.error("Gemini JSON API error:", error);
    throw error;
  }
}

/**
 * Fallback response when Gemini is unavailable.
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
