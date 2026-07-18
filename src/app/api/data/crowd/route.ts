// GET /api/data/crowd — Crowd metrics from simulator
import { getCrowdMetrics } from "@/data/simulator";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return Response.json({ zones: getCrowdMetrics(), timestamp: new Date().toISOString() });
  } catch (error) {
    console.error("Crowd data error:", error);
    return Response.json({ error: "Failed to fetch crowd data" }, { status: 500 });
  }
}
