// ============================================================================
// FIFA Nexus AI — Stadium Simulation Engine
// Generates realistic real-time data for demo purposes.
// All data varies based on match minute to create realistic match-day patterns.
// ============================================================================

import type {
  CrowdMetric,
  TransportMetric,
  SustainabilityMetrics,
  WeatherData,
  Alert,
  MatchInfo,
  FoodVendor,
  RiskLevel,
  TransportMode,
  TransportStatus,
  AlertType,
  AlertSeverity,
} from "@/types";
import stadiumData from "@/data/stadium.json";
import vendorData from "@/data/vendors.json";
import { generateId, clamp } from "@/lib/utils";
import { RISK_THRESHOLDS } from "@/lib/constants";

// --- Deterministic seeded random for consistent results per tick ---

function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
}

function noise(seed: number, variance: number): number {
  return (seededRandom(seed) - 0.5) * 2 * variance;
}

// --- Match Time ---

/**
 * Get the current simulated match minute.
 * Maps real wall-clock time to an accelerated match timeline.
 * One real minute = ~2 simulated minutes for demo speed.
 */
export function getMatchMinute(): number {
  const baseTime = new Date("2026-07-16T18:00:00Z").getTime();
  const elapsed = (Date.now() - baseTime) / 1000 / 60; // real minutes elapsed
  const simulated = elapsed * 2; // accelerated
  return Math.floor(simulated % 200) - 30; // cycle from -30 to 170
}

/**
 * Get current match info.
 */
export function getMatchInfo(): MatchInfo {
  const minute = getMatchMinute();
  let status: MatchInfo["status"] = "scheduled";
  if (minute < 0) status = "scheduled";
  else if (minute <= 45) status = "live";
  else if (minute <= 60) status = "halftime";
  else if (minute <= 105) status = "live";
  else status = "completed";

  const baseAttendance = 78542;
  const arrivalFactor = minute < 0 ? clamp((minute + 30) / 30, 0.3, 1) : 1;
  const attendance = Math.floor(baseAttendance * arrivalFactor);

  return {
    id: "match-2026-sf-1",
    teamHome: "Brazil",
    teamAway: "Germany",
    stadium: "MetLife Stadium",
    kickoffTime: "2026-07-16T19:00:00Z",
    status,
    minute: Math.max(0, minute),
    attendance,
    expectedAttendance: 82500,
  };
}

// --- Crowd Simulation ---

/**
 * Generate crowd density based on match phase with realistic patterns.
 */
function getBaseDensity(zoneType: string, minute: number): number {
  // Pre-match: gradual filling
  if (minute < 0) {
    const progress = (minute + 30) / 30;
    if (zoneType === "gate") return clamp(progress * 70 + 20, 10, 90);
    if (zoneType === "stand") return clamp(progress * 50, 5, 50);
    if (zoneType === "food_court") return clamp(progress * 40 + 10, 10, 50);
    if (zoneType === "parking") return clamp(progress * 80 + 10, 10, 90);
    return clamp(progress * 30, 5, 40);
  }

  // First half: settled, moderate density
  if (minute <= 45) {
    if (zoneType === "stand") return 85 + Math.sin(minute / 10) * 5;
    if (zoneType === "gate") return 20 + Math.sin(minute / 15) * 10;
    if (zoneType === "food_court") return 30 + Math.sin(minute / 8) * 15;
    if (zoneType === "parking") return 90;
    if (zoneType === "medical") return 15 + Math.sin(minute / 20) * 10;
    return 40;
  }

  // Halftime: concession rush
  if (minute <= 60) {
    const htProgress = (minute - 45) / 15;
    if (zoneType === "stand") return 60 - htProgress * 20;
    if (zoneType === "food_court") return 70 + htProgress * 25;
    if (zoneType === "gate") return 15;
    if (zoneType === "concourse") return 60 + htProgress * 30;
    return 50 + htProgress * 20;
  }

  // Second half: back in seats
  if (minute <= 105) {
    const shProgress = (minute - 60) / 45;
    if (zoneType === "stand") return 80 + shProgress * 10;
    if (zoneType === "food_court") return 85 - shProgress * 55;
    if (zoneType === "gate") return 10;
    return 35 - shProgress * 15;
  }

  // Post-match: mass exit
  const pmProgress = clamp((minute - 105) / 40, 0, 1);
  if (zoneType === "stand") return 90 - pmProgress * 85;
  if (zoneType === "gate") return 30 + (1 - pmProgress) * 60;
  if (zoneType === "food_court") return 20 - pmProgress * 15;
  if (zoneType === "parking") return 90 - pmProgress * 60;
  if (zoneType === "concourse") return 40 + (1 - pmProgress) * 50;
  return 30 - pmProgress * 20;
}

function getRiskLevel(density: number): RiskLevel {
  if (density >= RISK_THRESHOLDS.critical) return "critical";
  if (density >= RISK_THRESHOLDS.high) return "high";
  if (density >= RISK_THRESHOLDS.medium) return "medium";
  return "low";
}

function getTrend(current: number, zoneType: string, minute: number): "increasing" | "decreasing" | "stable" {
  const future = getBaseDensity(zoneType, minute + 2);
  const diff = future - current;
  if (diff > 2) return "increasing";
  if (diff < -2) return "decreasing";
  return "stable";
}

export function getCrowdMetrics(): CrowdMetric[] {
  const minute = getMatchMinute();
  const seed = Math.floor(Date.now() / 15000); // changes every 15 seconds

  return stadiumData.zones.map((zone, i) => {
    const baseDensity = getBaseDensity(zone.type, minute);
    const variance = noise(seed + i * 7, 8);
    const density = clamp(baseDensity + variance, 2, 99);
    const currentCount = Math.floor((density / 100) * zone.capacity);

    return {
      zoneId: zone.id,
      zoneCode: zone.code,
      zoneName: zone.name,
      currentCount,
      capacity: zone.capacity,
      densityPercent: Math.round(density * 10) / 10,
      riskLevel: getRiskLevel(density),
      flowRateIn: Math.max(0, Math.round((noise(seed + i * 13, 5) + 3) * 10) / 10),
      flowRateOut: Math.max(0, Math.round((noise(seed + i * 17, 5) + 2) * 10) / 10),
      trend: getTrend(density, zone.type, minute),
      timestamp: new Date().toISOString(),
    };
  });
}

// --- Transport Simulation ---

export function getTransportMetrics(): TransportMetric[] {
  const minute = getMatchMinute();
  const seed = Math.floor(Date.now() / 30000);

  const modes: { mode: TransportMode; name: string }[] = [
    { mode: "metro", name: "NJ Transit - Meadowlands Line" },
    { mode: "bus", name: "Route 160 - Port Authority" },
    { mode: "bus", name: "Route 772 - Secaucus Junction" },
    { mode: "rideshare", name: "Rideshare Zone" },
    { mode: "parking", name: "Parking Lot A" },
    { mode: "parking", name: "Parking Lot B" },
    { mode: "walking", name: "Secaucus Junction Walk" },
  ];

  return modes.map((t, i) => {
    let baseCongestion = 30;
    let baseWait = 5;

    // Post-match surge
    if (minute > 100) {
      const surge = clamp((minute - 100) / 20, 0, 1);
      baseCongestion = 30 + surge * 60;
      baseWait = 5 + surge * 20;
    } else if (minute < 0) {
      baseCongestion = 20 + clamp((minute + 30) / 30, 0, 1) * 40;
      baseWait = 3 + clamp((minute + 30) / 30, 0, 1) * 10;
    }

    if (t.mode === "parking") {
      baseCongestion = minute > 100 ? 85 : minute < 0 ? 40 : 75;
    }

    const congestion = clamp(baseCongestion + noise(seed + i * 11, 10), 5, 98);
    const wait = Math.max(1, Math.round(baseWait + noise(seed + i * 19, 3)));

    let status: TransportStatus = "normal";
    if (congestion > 80) status = "congested";
    else if (congestion > 60) status = "delayed";

    return {
      mode: t.mode,
      routeName: t.name,
      status,
      congestionLevel: Math.round(congestion * 10) / 10,
      estimatedWaitMinutes: wait,
      availableCapacity: Math.max(0, Math.floor((100 - congestion) * 20)),
      details: status === "congested"
        ? "Heavy traffic. Consider alternative routes."
        : status === "delayed"
        ? `Delays of approximately ${wait} minutes.`
        : "Operating normally.",
    };
  });
}

// --- Vendor Simulation ---

export function getVendorMetrics(): FoodVendor[] {
  const minute = getMatchMinute();
  const seed = Math.floor(Date.now() / 20000);

  return vendorData.map((vendor, i) => {
    let baseQueue = 3;

    // Halftime rush
    if (minute >= 42 && minute <= 65) {
      baseQueue = 8 + Math.sin((minute - 42) / 5) * 5;
    } else if (minute < 0) {
      baseQueue = 2;
    }

    const queue = Math.max(0, Math.round(baseQueue + noise(seed + i * 23, 3)));
    const wait = Math.max(1, Math.round(queue * 1.5 + noise(seed + i * 29, 1)));

    let status: FoodVendor["status"] = "open";
    if (queue > 10) status = "busy";
    if (minute > 110) status = "closing";
    if (minute > 140) status = "closed";

    return {
      ...vendor,
      queueLength: queue,
      estimatedWaitMinutes: wait,
      status,
    } as FoodVendor;
  });
}

// --- Weather Simulation ---

export function getWeatherData(): WeatherData {
  const seed = Math.floor(Date.now() / 300000); // changes every 5 minutes
  return {
    temperatureC: Math.round((28 + noise(seed, 3)) * 10) / 10,
    humidity: Math.round(65 + noise(seed + 1, 10)),
    windSpeedKmh: Math.round((12 + noise(seed + 2, 5)) * 10) / 10,
    windDirection: ["N", "NE", "NW", "E"][Math.floor(seededRandom(seed + 3) * 4)],
    conditions: seededRandom(seed + 4) > 0.7 ? "Partly Cloudy" : "Clear",
    uvIndex: Math.round((6 + noise(seed + 5, 2)) * 10) / 10,
    precipitationMm: 0,
    feelsLikeC: Math.round((30 + noise(seed + 6, 3)) * 10) / 10,
  };
}

// --- Sustainability Simulation ---

export function getSustainabilityMetrics(): SustainabilityMetrics {
  const minute = getMatchMinute();
  const seed = Math.floor(Date.now() / 60000);
  const elapsed = Math.max(0, minute + 30); // minutes since gates opened

  return {
    electricityKwh: Math.round((elapsed * 8.2 + noise(seed, 50)) * 10) / 10,
    solarGenerationKwh: Math.round((elapsed * 1.8 + noise(seed + 1, 20)) * 10) / 10,
    waterLiters: Math.round(elapsed * 62 + noise(seed + 2, 200)),
    recycledWaterLiters: Math.round(elapsed * 15 + noise(seed + 3, 50)),
    plasticWasteKg: Math.round((elapsed * 1.2 + noise(seed + 4, 10)) * 10) / 10,
    foodWasteKg: Math.round((elapsed * 0.8 + noise(seed + 5, 8)) * 10) / 10,
    generalWasteKg: Math.round((elapsed * 2.1 + noise(seed + 6, 15)) * 10) / 10,
    recycledKg: Math.round((elapsed * 0.9 + noise(seed + 7, 5)) * 10) / 10,
    carbonFootprintKgCo2: Math.round((elapsed * 3.5 + noise(seed + 8, 20)) * 10) / 10,
    timestamp: new Date().toISOString(),
  };
}

// --- Alert Simulation ---

const ALERT_TEMPLATES: {
  type: AlertType;
  severity: AlertSeverity;
  title: string;
  message: string;
  zone?: string;
  aiRecommendation?: string;
}[] = [
  {
    type: "crowd",
    severity: "warning",
    title: "High Density Alert",
    message: "North Stand A approaching 90% capacity. Flow rate increasing.",
    zone: "NS-A",
    aiRecommendation: "Redirect incoming visitors via Gate D. Open overflow section NS-B.",
  },
  {
    type: "security",
    severity: "warning",
    title: "Unusual Gathering Detected",
    message: "Camera 18 detected unusual clustering near Gate B entrance.",
    zone: "GB",
    aiRecommendation: "Likely caused by delayed entry processing. Deploy additional gate operator.",
  },
  {
    type: "medical",
    severity: "info",
    title: "Medical Supply Alert",
    message: "Medical Station 2 running low on cold compress supplies.",
    zone: "MED-2",
    aiRecommendation: "Dispatch supply runner from main inventory. Est. 8 min.",
  },
  {
    type: "transport",
    severity: "warning",
    title: "Metro Delay",
    message: "NJ Transit Meadowlands Line reporting 8-minute delays.",
    aiRecommendation: "Update departure boards. Suggest bus Route 160 as alternative for next 30 min.",
  },
  {
    type: "weather",
    severity: "info",
    title: "UV Index Advisory",
    message: "UV index at 7.2. Sun exposure risk for uncovered sections.",
    aiRecommendation: "Activate mist cooling in West Stand concourse. Push sunscreen reminder to fan app.",
  },
  {
    type: "crowd",
    severity: "critical",
    title: "Critical Density Zone",
    message: "South Food Court at 95% capacity during halftime rush.",
    zone: "FC-S",
    aiRecommendation: "Temporarily close FC-S entry. Redirect to North Food Court (62% capacity). Deploy 3 volunteers for crowd flow.",
  },
  {
    type: "sustainability",
    severity: "info",
    title: "Energy Spike Detected",
    message: "HVAC system drawing 15% above baseline in East Stand.",
    zone: "ES",
    aiRecommendation: "Reduce HVAC to economy mode. Current temperature within comfort range.",
  },
  {
    type: "security",
    severity: "info",
    title: "Unattended Item",
    message: "Camera 22 flagged unattended bag near South Stand entrance. Under review.",
    zone: "SS-A",
    aiRecommendation: "85% likely personal item based on context. Owner visible nearby. Monitor for 3 more minutes.",
  },
];

export function getAlerts(): Alert[] {
  const minute = getMatchMinute();
  const seed = Math.floor(Date.now() / 20000);
  const count = minute > 40 && minute < 70 ? 4 : 2; // more alerts during halftime

  const alerts: Alert[] = [];
  for (let i = 0; i < count; i++) {
    const idx = Math.floor(seededRandom(seed + i * 31) * ALERT_TEMPLATES.length);
    const template = ALERT_TEMPLATES[idx];
    alerts.push({
      id: generateId(),
      ...template,
      timestamp: new Date(Date.now() - i * 180000).toISOString(), // spaced 3 min apart
      acknowledged: i > 1, // older ones acknowledged
    });
  }

  return alerts;
}

// --- Full Dashboard Data ---

export function getDashboardData() {
  const crowdMetrics = getCrowdMetrics();
  const totalCapacity = stadiumData.zones
    .filter((z) => z.type === "stand" || z.type === "vip")
    .reduce((sum, z) => sum + z.capacity, 0);
  const totalOccupied = crowdMetrics
    .filter((m) => {
      const zone = stadiumData.zones.find((z) => z.id === m.zoneId);
      return zone?.type === "stand" || zone?.type === "vip";
    })
    .reduce((sum, m) => sum + m.currentCount, 0);

  const vendors = getVendorMetrics();
  const openVendors = vendors.filter((v) => v.status !== "closed");

  return {
    match: getMatchInfo(),
    crowd: {
      totalOccupancy: Math.round((totalOccupied / totalCapacity) * 1000) / 10,
      zones: crowdMetrics,
    },
    weather: getWeatherData(),
    transport: getTransportMetrics(),
    security: {
      activeAlerts: 2,
      camerasOnline: 48,
      camerasTotal: 50,
    },
    medical: {
      activeIncidents: 1,
      teamsAvailable: 4,
      avgResponseTimeSec: 180,
    },
    vendors: {
      openCount: openVendors.length,
      totalCount: vendors.length,
      avgQueueMinutes:
        Math.round(
          (openVendors.reduce((sum, v) => sum + v.estimatedWaitMinutes, 0) /
            Math.max(1, openVendors.length)) *
            10
        ) / 10,
    },
    sustainability: getSustainabilityMetrics(),
    alerts: getAlerts(),
  };
}
