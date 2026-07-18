// GET /api/health — Health check endpoint
export async function GET() {
  return Response.json({
    status: "healthy",
    service: "FIFA Nexus AI",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
}
