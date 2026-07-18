// GET /api/data/sustainability — Sustainability metrics
import { getSustainabilityMetrics } from "@/data/simulator";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return Response.json(getSustainabilityMetrics());
  } catch (error) {
    console.error("Sustainability data error:", error);
    return Response.json({ error: "Failed to fetch sustainability data" }, { status: 500 });
  }
}
