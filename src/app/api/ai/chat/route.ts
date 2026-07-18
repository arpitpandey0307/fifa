// POST /api/ai/chat — Fan AI Assistant (multilingual)
import { callGemini } from "@/lib/gemini";
import { FAN_ASSISTANT_PROMPT, buildFanContext } from "@/lib/prompts";
import { chatRequestSchema } from "@/lib/schemas";
import { getVendorMetrics, getCrowdMetrics } from "@/data/simulator";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = chatRequestSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { message, context } = parsed.data;

    // Build stadium context for the AI
    const vendors = getVendorMetrics();
    const crowd = getCrowdMetrics();
    const userZoneCrowd = crowd.find((z) => z.zoneCode === context.zone);

    const stadiumContext = {
      nearbyVendors: vendors.slice(0, 5).map((v) => ({
        name: v.name,
        cuisine: v.cuisine,
        queue: v.estimatedWaitMinutes,
        isVegetarian: v.isVegetarian,
        isHalal: v.isHalal,
        status: v.status,
      })),
      currentZoneDensity: userZoneCrowd?.densityPercent ?? 50,
      zoneRisk: userZoneCrowd?.riskLevel ?? "low",
    };

    const contextString = buildFanContext(context, stadiumContext);
    const fullMessage = `${contextString}\n\n---\n\nFan Message: ${message}`;

    const response = await callGemini(FAN_ASSISTANT_PROMPT, fullMessage, {
      model: "gemini-2.0-flash",
      temperature: 0.8,
    });

    return Response.json({
      response,
      detectedLanguage: detectLanguage(message),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return Response.json(
      { error: "Failed to process chat request" },
      { status: 500 }
    );
  }
}

function detectLanguage(text: string): string {
  if (/[\u0900-\u097F]/.test(text)) return "hi";
  if (/[\u0600-\u06FF]/.test(text)) return "ar";
  if (/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/.test(text)) return "ja";
  if (/[áéíóúñ¿¡]/i.test(text)) return "es";
  if (/[àâçéèêëïîôùûüÿœæ]/i.test(text)) return "fr";
  if (/[äöüß]/i.test(text)) return "de";
  return "en";
}
