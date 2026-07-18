// GET /api/data/dashboard — All dashboard data from simulator
import { getDashboardData } from "@/data/simulator";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = getDashboardData();
    return Response.json(data);
  } catch (error) {
    console.error("Dashboard data error:", error);
    return Response.json({ error: "Failed to fetch dashboard data" }, { status: 500 });
  }
}
