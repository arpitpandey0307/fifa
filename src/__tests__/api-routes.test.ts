// ============================================================================
// FIFA Nexus AI — API Route Tests
// Integration tests for data and AI API endpoints.
// ============================================================================

import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the simulator to avoid time-dependent behavior
vi.mock("@/data/simulator", () => ({
  getDashboardData: vi.fn(() => ({
    match: {
      id: "match-test",
      teamHome: "Brazil",
      teamAway: "Germany",
      stadium: "MetLife Stadium",
      kickoffTime: "2026-07-16T19:00:00Z",
      status: "live",
      minute: 35,
      attendance: 75000,
      expectedAttendance: 82500,
    },
    crowd: {
      totalOccupancy: 85.2,
      zones: [
        {
          zoneId: "ns-a",
          zoneCode: "NS-A",
          zoneName: "North Stand A",
          currentCount: 8500,
          capacity: 10000,
          densityPercent: 85,
          riskLevel: "high",
          flowRateIn: 5.2,
          flowRateOut: 3.1,
          trend: "increasing",
          timestamp: new Date().toISOString(),
        },
      ],
    },
    weather: {
      temperatureC: 28,
      humidity: 65,
      windSpeedKmh: 12,
      windDirection: "NE",
      conditions: "Clear",
      uvIndex: 6.5,
      precipitationMm: 0,
      feelsLikeC: 30,
    },
    transport: [
      {
        mode: "metro",
        routeName: "NJ Transit",
        status: "normal",
        congestionLevel: 45,
        estimatedWaitMinutes: 5,
        availableCapacity: 1100,
        details: "Operating normally.",
      },
    ],
    security: { activeAlerts: 2, camerasOnline: 48, camerasTotal: 50 },
    medical: { activeIncidents: 1, teamsAvailable: 4, avgResponseTimeSec: 180 },
    vendors: { openCount: 12, totalCount: 14, avgQueueMinutes: 3.5 },
    sustainability: {
      electricityKwh: 450,
      solarGenerationKwh: 80,
      waterLiters: 3200,
      recycledWaterLiters: 800,
      plasticWasteKg: 55,
      foodWasteKg: 35,
      generalWasteKg: 90,
      recycledKg: 40,
      carbonFootprintKgCo2: 180,
      timestamp: new Date().toISOString(),
    },
    alerts: [],
  })),
  getCrowdMetrics: vi.fn(() => [
    {
      zoneId: "ns-a",
      zoneCode: "NS-A",
      zoneName: "North Stand A",
      currentCount: 8500,
      capacity: 10000,
      densityPercent: 85,
      riskLevel: "high",
      flowRateIn: 5.2,
      flowRateOut: 3.1,
      trend: "increasing",
      timestamp: new Date().toISOString(),
    },
  ]),
  getTransportMetrics: vi.fn(() => [
    {
      mode: "metro",
      routeName: "NJ Transit",
      status: "normal",
      congestionLevel: 45,
      estimatedWaitMinutes: 5,
      availableCapacity: 1100,
      details: "Operating normally.",
    },
  ]),
  getSustainabilityMetrics: vi.fn(() => ({
    electricityKwh: 450,
    solarGenerationKwh: 80,
    waterLiters: 3200,
    recycledWaterLiters: 800,
    plasticWasteKg: 55,
    foodWasteKg: 35,
    generalWasteKg: 90,
    recycledKg: 40,
    carbonFootprintKgCo2: 180,
    timestamp: new Date().toISOString(),
  })),
  getVendorMetrics: vi.fn(() => []),
  getMatchInfo: vi.fn(() => ({
    id: "match-test",
    teamHome: "Brazil",
    teamAway: "Germany",
    stadium: "MetLife Stadium",
    kickoffTime: "2026-07-16T19:00:00Z",
    status: "live",
    minute: 35,
    attendance: 75000,
    expectedAttendance: 82500,
  })),
}));

describe("Dashboard API Route", () => {
  it("GET /api/data/dashboard returns valid dashboard data", async () => {
    const { GET } = await import("@/app/api/data/dashboard/route");
    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty("match");
    expect(data).toHaveProperty("crowd");
    expect(data).toHaveProperty("weather");
    expect(data).toHaveProperty("transport");
    expect(data).toHaveProperty("security");
    expect(data).toHaveProperty("medical");
    expect(data).toHaveProperty("vendors");
    expect(data).toHaveProperty("sustainability");
    expect(data.match.teamHome).toBe("Brazil");
  });
});

describe("Crowd API Route", () => {
  it("GET /api/data/crowd returns zone data", async () => {
    const { GET } = await import("@/app/api/data/crowd/route");
    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty("zones");
    expect(data).toHaveProperty("timestamp");
    expect(Array.isArray(data.zones)).toBe(true);
  });
});

describe("Transport API Route", () => {
  it("GET /api/data/transport returns transport data", async () => {
    const { GET } = await import("@/app/api/data/transport/route");
    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty("transport");
    expect(Array.isArray(data.transport)).toBe(true);
  });
});

describe("Sustainability API Route", () => {
  it("GET /api/data/sustainability returns metrics", async () => {
    const { GET } = await import("@/app/api/data/sustainability/route");
    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty("electricityKwh");
    expect(data).toHaveProperty("waterLiters");
    expect(data).toHaveProperty("carbonFootprintKgCo2");
  });
});

describe("Health API Route", () => {
  it("GET /api/health returns healthy status", async () => {
    const { GET } = await import("@/app/api/health/route");
    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.status).toBe("healthy");
    expect(data.service).toBe("FIFA Nexus AI");
    expect(data).toHaveProperty("version");
    expect(data).toHaveProperty("timestamp");
  });
});

describe("Chat API Route - Input Validation", () => {
  it("rejects empty message body", async () => {
    const { POST } = await import("@/app/api/ai/chat/route");
    const request = new Request("http://localhost/api/ai/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "" }),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
  });

  it("rejects oversized message", async () => {
    const { POST } = await import("@/app/api/ai/chat/route");
    const request = new Request("http://localhost/api/ai/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "x".repeat(2001) }),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
  });

  it("accepts valid chat message", async () => {
    const { POST } = await import("@/app/api/ai/chat/route");
    const request = new Request("http://localhost/api/ai/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Where is my gate?" }),
    });

    const response = await POST(request);
    const data = await response.json();
    expect(response.status).toBe(200);
    expect(data).toHaveProperty("response");
    expect(data).toHaveProperty("detectedLanguage");
    expect(data).toHaveProperty("timestamp");
  });
});

describe("Incident API Route - Input Validation", () => {
  it("rejects short descriptions", async () => {
    const { POST } = await import("@/app/api/ai/incident/route");
    const request = new Request("http://localhost/api/ai/incident", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description: "hi" }),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
  });

  it("accepts valid incident report", async () => {
    const { POST } = await import("@/app/api/ai/incident/route");
    const request = new Request("http://localhost/api/ai/incident", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description: "Someone fainted near Gate B" }),
    });

    const response = await POST(request);
    const data = await response.json();
    expect(response.status).toBe(200);
    expect(data).toHaveProperty("triage");
    expect(data.triage).toHaveProperty("incidentType");
    expect(data.triage).toHaveProperty("severity");
  });
});

describe("Predict API Route - Input Validation", () => {
  it("accepts request with zone IDs", async () => {
    const { POST } = await import("@/app/api/ai/predict/route");
    const request = new Request("http://localhost/api/ai/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ zoneIds: ["NS-A"] }),
    });

    const response = await POST(request);
    const data = await response.json();
    expect(response.status).toBe(200);
    expect(data).toHaveProperty("predictions");
    expect(data).toHaveProperty("matchMinute");
  });
});
