// GET /api/health — Health check endpoint for Cloud Run and monitoring.

import { APP_NAME, APP_VERSION } from "@/lib/constants";

/**
 * Returns the current health status of the service.
 * Used by Docker HEALTHCHECK, Cloud Run readiness probes, and load balancers.
 */
export async function GET() {
  return Response.json({
    status: "healthy",
    service: APP_NAME,
    version: APP_VERSION,
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
  });
}
