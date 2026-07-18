// GET /api/ai/summary — AI-generated dashboard situation summary
import { callGeminiJSON } from "@/lib/gemini";
import { DASHBOARD_SUMMARY_PROMPT, buildDashboardContext } from "@/lib/prompts";
import { getDashboardData } from "@/data/simulator";
import type { AISummary } from "@/types";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = getDashboardData();
    const context = buildDashboardContext(data);

    let result: AISummary;

    try {
      const aiResponse = await callGeminiJSON<{
        summary: string;
        priorityActions: string[];
        riskLevel: string;
      }>(DASHBOARD_SUMMARY_PROMPT, context, {
        model: "gemini-2.0-flash",
        temperature: 0.5,
      });

      result = {
        summary: aiResponse.summary,
        priorityActions: aiResponse.priorityActions,
        riskLevel: (aiResponse.riskLevel as AISummary["riskLevel"]) || "medium",
        timestamp: new Date().toISOString(),
      };
    } catch {
      // Fallback when Gemini is unavailable
      const highRiskZones = data.crowd.zones.filter(
        (z) => z.riskLevel === "high" || z.riskLevel === "critical"
      );

      result = {
        summary: `Stadium operating at ${data.crowd.totalOccupancy}% capacity with ${data.match.attendance.toLocaleString()} fans. ${
          highRiskZones.length > 0
            ? `${highRiskZones.length} zone(s) at elevated density: ${highRiskZones.map((z) => `${z.zoneCode} (${z.densityPercent}%)`).join(", ")}. `
            : "All zones within safe density levels. "
        }Weather conditions stable at ${data.weather.temperatureC}°C ${data.weather.conditions}. ${
          data.transport.some((t) => t.status === "delayed")
            ? "Transport delays detected — consider alternate routing."
            : "Transport systems operating normally."
        }`,
        priorityActions: [
          highRiskZones.length > 0
            ? `Monitor ${highRiskZones[0]?.zoneCode} density — approaching threshold`
            : "Maintain current operations — all zones nominal",
          "Review vendor queue distribution for optimization",
          "Pre-position volunteers for anticipated halftime rush",
        ],
        riskLevel: highRiskZones.length > 0 ? "high" : "medium",
        timestamp: new Date().toISOString(),
      };
    }

    return Response.json(result);
  } catch (error) {
    console.error("Summary API error:", error);
    return Response.json(
      { error: "Failed to generate summary" },
      { status: 500 }
    );
  }
}
