// GET /api/data/transport — Transport metrics
import { getTransportMetrics } from "@/data/simulator";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return Response.json({ transport: getTransportMetrics(), timestamp: new Date().toISOString() });
  } catch (error) {
    console.error("Transport data error:", error);
    return Response.json({ error: "Failed to fetch transport data" }, { status: 500 });
  }
}
