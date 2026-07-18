// POST /api/ai/incident — AI incident triage from natural language
import { callGeminiJSON } from "@/lib/gemini";
import { INCIDENT_TRIAGE_PROMPT } from "@/lib/prompts";
import { incidentRequestSchema } from "@/lib/schemas";
import { getCrowdMetrics, getMatchInfo } from "@/data/simulator";
import type { IncidentTriageResult } from "@/types";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = incidentRequestSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { description } = parsed.data;
    const crowd = getCrowdMetrics();
    const match = getMatchInfo();

    const context = `Match: ${match.teamHome} vs ${match.teamAway}, Minute: ${match.minute}
Current zone densities:
${crowd.map((z) => `${z.zoneCode}: ${z.densityPercent}%`).join(", ")}

Incident Report: "${description}"`;

    let triage: IncidentTriageResult;

    try {
      triage = await callGeminiJSON<IncidentTriageResult>(
        INCIDENT_TRIAGE_PROMPT,
        context,
        { model: "gemini-2.5-pro", temperature: 0.2 }
      );
    } catch {
      // Intelligent fallback based on keyword extraction
      const lower = description.toLowerCase();
      const isMedical = /faint|hurt|injur|sick|pain|bleeding|unconscious|heart|breath/.test(lower);
      const isSecurity = /fight|weapon|suspicious|threat|stolen|aggressive/.test(lower);
      const isFire = /fire|smoke|burning/.test(lower);

      const zoneMatch = description.match(/(?:gate|zone|stand|section|food court|parking)\s*([A-Z0-9-]+)/i);
      const zone = zoneMatch ? zoneMatch[1].toUpperCase() : "NS-A";
      const zoneCrowd = crowd.find((z) => z.zoneCode === zone);

      triage = {
        incidentType: isFire ? "fire" : isSecurity ? "security" : isMedical ? "medical" : "other",
        severity: isFire ? "critical" : isMedical ? "high" : "medium",
        extractedLocation: zoneMatch ? `Near ${zoneMatch[0]}` : "Location needs confirmation",
        zoneId: zone,
        nearestResponder: {
          teamId: "MED-03",
          currentLocation: "Medical Station 2",
          estimatedArrivalMinutes: 2.5,
        },
        crowdLevelAtLocation: zoneCrowd?.densityPercent ?? 50,
        fastestRoute: ["Medical Station 2", "Corridor C", zone],
        dispatchRecommendation: `Deploy nearest ${isMedical ? "medical" : "security"} team to ${zone}. Alert gate supervisor. ${
          (zoneCrowd?.densityPercent ?? 0) > 80
            ? "High crowd density — request security to create clearance zone."
            : ""
        }`,
        additionalActions: [
          "Notify stadium control room",
          "Log incident in system",
          "Prepare follow-up report",
        ],
      };
    }

    return Response.json({
      triage,
      matchMinute: match.minute,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Incident API error:", error);
    return Response.json({ error: "Failed to triage incident" }, { status: 500 });
  }
}
