// POST /api/ai/predict — AI crowd density prediction
import { callGeminiJSON } from "@/lib/gemini";
import { CROWD_PREDICTION_PROMPT } from "@/lib/prompts";
import { getCrowdMetrics, getMatchInfo } from "@/data/simulator";
import { predictionRequestSchema } from "@/lib/schemas";
import type { CrowdPrediction } from "@/types";
import { clamp } from "@/lib/utils";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = predictionRequestSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const metrics = getCrowdMetrics();
    const matchInfo = getMatchInfo();
    const zones = parsed.data.zoneIds.length > 0
      ? metrics.filter((m) => parsed.data.zoneIds.includes(m.zoneCode))
      : metrics.filter((m) => ["NS-A", "NS-B", "SS-A", "SS-B", "ES", "WS", "FC-N", "FC-S"].includes(m.zoneCode));

    const context = `Match Minute: ${matchInfo.minute}
Match Status: ${matchInfo.status}
Attendance: ${matchInfo.attendance}

Zone Metrics:
${zones.map((z) => `${z.zoneCode}: ${z.densityPercent}% (${z.riskLevel}) trend: ${z.trend} flow_in: ${z.flowRateIn} flow_out: ${z.flowRateOut}`).join("\n")}`;

    let predictions: CrowdPrediction[];

    try {
      const aiResult = await callGeminiJSON<{ predictions: CrowdPrediction[] }>(
        CROWD_PREDICTION_PROMPT,
        context,
        { model: "gemini-2.0-flash", temperature: 0.3 }
      );
      predictions = aiResult.predictions;
    } catch {
      // Generate algorithmic fallback predictions
      predictions = zones.map((zone) => {
        const base = zone.densityPercent;
        const isHalftime = matchInfo.minute >= 42 && matchInfo.minute <= 60;
        const isPostMatch = matchInfo.minute > 100;
        const isStand = zone.zoneCode.startsWith("NS") || zone.zoneCode.startsWith("SS") || zone.zoneCode === "ES" || zone.zoneCode === "WS";
        const isFoodCourt = zone.zoneCode.startsWith("FC");

        let delta5 = zone.trend === "increasing" ? 3 : zone.trend === "decreasing" ? -3 : 0;
        let delta10 = delta5 * 1.8;
        let delta15 = delta5 * 2.2;

        if (isHalftime && isFoodCourt) { delta5 += 5; delta10 += 10; delta15 += 8; }
        if (isHalftime && isStand) { delta5 -= 5; delta10 -= 10; delta15 += 5; }
        if (isPostMatch && isStand) { delta5 -= 8; delta10 -= 15; delta15 -= 20; }

        return {
          zoneId: zone.zoneId,
          zoneCode: zone.zoneCode,
          currentDensity: base,
          predicted5min: clamp(base + delta5, 2, 99),
          predicted10min: clamp(base + delta10, 2, 99),
          predicted15min: clamp(base + delta15, 2, 99),
          confidence5min: 0.88,
          confidence10min: 0.74,
          confidence15min: 0.61,
          riskLevel: zone.riskLevel,
          suggestedActions: base > 85
            ? ["Redirect flow to adjacent zones", "Deploy crowd management volunteers", "Open overflow sections"]
            : ["Continue monitoring", "No action required"],
          reasoning: `Zone ${zone.zoneCode} at ${base}% with ${zone.trend} trend. Match minute ${matchInfo.minute} (${matchInfo.status}).`,
          timestamp: new Date().toISOString(),
        };
      });
    }

    return Response.json({
      predictions,
      matchMinute: matchInfo.minute,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Prediction API error:", error);
    return Response.json({ error: "Failed to generate predictions" }, { status: 500 });
  }
}
