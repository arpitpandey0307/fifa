// ============================================================================
// FIFA Nexus AI — Simulator Engine Tests
// ============================================================================

import { describe, it, expect } from "vitest";
import {
  getDashboardData,
  getCrowdMetrics,
  getTransportMetrics,
  getSustainabilityMetrics,
  getMatchInfo,
  getVendorMetrics,
} from "@/data/simulator";

describe("getDashboardData", () => {
  it("returns a complete dashboard data object", () => {
    const data = getDashboardData();

    expect(data).toHaveProperty("match");
    expect(data).toHaveProperty("crowd");
    expect(data).toHaveProperty("weather");
    expect(data).toHaveProperty("transport");
    expect(data).toHaveProperty("security");
    expect(data).toHaveProperty("medical");
    expect(data).toHaveProperty("vendors");
    expect(data).toHaveProperty("sustainability");
    expect(data).toHaveProperty("alerts");
  });

  it("returns valid match info", () => {
    const data = getDashboardData();
    expect(data.match.teamHome).toBeTruthy();
    expect(data.match.teamAway).toBeTruthy();
    expect(data.match.stadium).toBeTruthy();
    expect(data.match.minute).toBeGreaterThanOrEqual(0);
    expect(data.match.attendance).toBeGreaterThan(0);
  });

  it("returns crowd data with valid occupancy", () => {
    const data = getDashboardData();
    expect(data.crowd.totalOccupancy).toBeGreaterThanOrEqual(0);
    expect(data.crowd.totalOccupancy).toBeLessThanOrEqual(100);
    expect(data.crowd.zones.length).toBeGreaterThan(0);
  });

  it("returns weather data with valid ranges", () => {
    const data = getDashboardData();
    expect(data.weather.temperatureC).toBeGreaterThan(-50);
    expect(data.weather.temperatureC).toBeLessThan(60);
    expect(data.weather.humidity).toBeGreaterThanOrEqual(0);
    expect(data.weather.humidity).toBeLessThanOrEqual(100);
  });
});

describe("getCrowdMetrics", () => {
  it("returns an array of zone metrics", () => {
    const metrics = getCrowdMetrics();
    expect(Array.isArray(metrics)).toBe(true);
    expect(metrics.length).toBeGreaterThan(0);
  });

  it("each zone has required properties", () => {
    const metrics = getCrowdMetrics();
    for (const zone of metrics) {
      expect(zone).toHaveProperty("zoneId");
      expect(zone).toHaveProperty("zoneCode");
      expect(zone).toHaveProperty("zoneName");
      expect(zone).toHaveProperty("currentCount");
      expect(zone).toHaveProperty("capacity");
      expect(zone).toHaveProperty("densityPercent");
      expect(zone).toHaveProperty("riskLevel");
      expect(zone).toHaveProperty("trend");
    }
  });

  it("density percentages are between 0 and 100", () => {
    const metrics = getCrowdMetrics();
    for (const zone of metrics) {
      expect(zone.densityPercent).toBeGreaterThanOrEqual(0);
      expect(zone.densityPercent).toBeLessThanOrEqual(100);
    }
  });

  it("risk levels are valid enum values", () => {
    const validLevels = ["low", "medium", "high", "critical"];
    const metrics = getCrowdMetrics();
    for (const zone of metrics) {
      expect(validLevels).toContain(zone.riskLevel);
    }
  });
});

describe("getTransportMetrics", () => {
  it("returns transport data array", () => {
    const metrics = getTransportMetrics();
    expect(Array.isArray(metrics)).toBe(true);
    expect(metrics.length).toBeGreaterThan(0);
  });

  it("each transport has valid congestion level", () => {
    const metrics = getTransportMetrics();
    for (const t of metrics) {
      expect(t.congestionLevel).toBeGreaterThanOrEqual(0);
      expect(t.congestionLevel).toBeLessThanOrEqual(100);
    }
  });
});

describe("getSustainabilityMetrics", () => {
  it("returns sustainability metrics", () => {
    const metrics = getSustainabilityMetrics();
    expect(metrics).toHaveProperty("electricityKwh");
    expect(metrics).toHaveProperty("waterLiters");
    expect(metrics).toHaveProperty("carbonFootprintKgCo2");
    expect(metrics.electricityKwh).toBeGreaterThan(0);
  });
});

describe("getMatchInfo", () => {
  it("returns valid match info", () => {
    const match = getMatchInfo();
    expect(match.teamHome).toBeTruthy();
    expect(match.teamAway).toBeTruthy();
    const validStatuses = ["scheduled", "live", "halftime", "completed"];
    expect(validStatuses).toContain(match.status);
  });
});

describe("getVendorMetrics", () => {
  it("returns vendor array", () => {
    const vendors = getVendorMetrics();
    expect(Array.isArray(vendors)).toBe(true);
    expect(vendors.length).toBeGreaterThan(0);
  });

  it("each vendor has required fields", () => {
    const vendors = getVendorMetrics();
    for (const v of vendors) {
      expect(v).toHaveProperty("name");
      expect(v).toHaveProperty("cuisine");
      expect(v).toHaveProperty("status");
      expect(v).toHaveProperty("estimatedWaitMinutes");
    }
  });
});
