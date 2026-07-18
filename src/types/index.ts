// ============================================================================
// FIFA Nexus AI — TypeScript Type Definitions
// ============================================================================

// --- Stadium & Zones ---

export type RiskLevel = "low" | "medium" | "high" | "critical";

export type ZoneType =
  | "stand"
  | "concourse"
  | "gate"
  | "parking"
  | "food_court"
  | "medical"
  | "vip"
  | "service";

export interface StadiumZone {
  id: string;
  code: string;
  name: string;
  type: ZoneType;
  capacity: number;
  coordinates: { lat: number; lng: number };
  polygon: [number, number][];
  isAccessible: boolean;
}

export interface Stadium {
  id: string;
  name: string;
  city: string;
  country: string;
  totalCapacity: number;
  coordinates: { lat: number; lng: number };
  zones: StadiumZone[];
}

// --- Crowd ---

export interface CrowdMetric {
  zoneId: string;
  zoneCode: string;
  zoneName: string;
  currentCount: number;
  capacity: number;
  densityPercent: number;
  riskLevel: RiskLevel;
  flowRateIn: number;
  flowRateOut: number;
  trend: "increasing" | "decreasing" | "stable";
  timestamp: string;
}

export interface CrowdPrediction {
  zoneId: string;
  zoneCode: string;
  currentDensity: number;
  predicted5min: number;
  predicted10min: number;
  predicted15min: number;
  confidence5min: number;
  confidence10min: number;
  confidence15min: number;
  riskLevel: RiskLevel;
  suggestedActions: string[];
  reasoning: string;
  timestamp: string;
}

// --- Transport ---

export type TransportMode = "metro" | "bus" | "rideshare" | "parking" | "walking";

export type TransportStatus = "normal" | "delayed" | "congested" | "closed";

export interface TransportMetric {
  mode: TransportMode;
  routeName: string;
  status: TransportStatus;
  congestionLevel: number;
  estimatedWaitMinutes: number;
  availableCapacity: number;
  details: string;
}

export interface TransportRecommendation {
  bestExitGate: string;
  bestRoute: RouteDetail;
  leastCrowdedRoute: RouteDetail;
  recommendedDepartureTime: string;
  reasoning: string;
}

export interface RouteDetail {
  path: string[];
  distanceM: number;
  durationMinutes: number;
  transportMode: TransportMode;
  crowdLevel: RiskLevel;
}

// --- Incidents ---

export type IncidentType =
  | "medical"
  | "security"
  | "fire"
  | "structural"
  | "crowd"
  | "weather"
  | "other";

export type IncidentSeverity = "low" | "medium" | "high" | "critical";

export type IncidentStatus =
  | "reported"
  | "triaged"
  | "dispatched"
  | "in_progress"
  | "resolved";

export interface Incident {
  id: string;
  type: IncidentType;
  severity: IncidentSeverity;
  status: IncidentStatus;
  description: string;
  aiSummary: string;
  location: {
    zone: string;
    description: string;
    coordinates: { lat: number; lng: number };
  };
  nearestResponder: {
    teamId: string;
    location: string;
    estimatedArrivalMinutes: number;
  };
  crowdLevelAtLocation: number;
  fastestRoute: string[];
  dispatchRecommendation: string;
  reportedAt: string;
  resolvedAt?: string;
}

export interface IncidentTriageResult {
  incidentType: IncidentType;
  severity: IncidentSeverity;
  extractedLocation: string;
  zoneId: string;
  nearestResponder: {
    teamId: string;
    currentLocation: string;
    estimatedArrivalMinutes: number;
  };
  crowdLevelAtLocation: number;
  fastestRoute: string[];
  dispatchRecommendation: string;
  additionalActions: string[];
}

// --- Vendor ---

export interface FoodVendor {
  id: string;
  name: string;
  zone: string;
  cuisine: string;
  isHalal: boolean;
  isVegetarian: boolean;
  isAccessible: boolean;
  queueLength: number;
  estimatedWaitMinutes: number;
  status: "open" | "busy" | "closing" | "closed";
  menuHighlights: string[];
  coordinates: { lat: number; lng: number };
}

// --- Sustainability ---

export interface SustainabilityMetrics {
  electricityKwh: number;
  solarGenerationKwh: number;
  waterLiters: number;
  recycledWaterLiters: number;
  plasticWasteKg: number;
  foodWasteKg: number;
  generalWasteKg: number;
  recycledKg: number;
  carbonFootprintKgCo2: number;
  timestamp: string;
}

// --- Weather ---

export interface WeatherData {
  temperatureC: number;
  humidity: number;
  windSpeedKmh: number;
  windDirection: string;
  conditions: string;
  uvIndex: number;
  precipitationMm: number;
  feelsLikeC: number;
}

// --- Alerts ---

export type AlertType =
  | "crowd"
  | "security"
  | "medical"
  | "weather"
  | "transport"
  | "sustainability"
  | "system";

export type AlertSeverity = "info" | "warning" | "critical" | "emergency";

export interface Alert {
  id: string;
  type: AlertType;
  severity: AlertSeverity;
  title: string;
  message: string;
  aiRecommendation?: string;
  zone?: string;
  timestamp: string;
  acknowledged: boolean;
}

// --- Dashboard ---

export interface DashboardData {
  match: MatchInfo;
  crowd: {
    totalOccupancy: number;
    zones: CrowdMetric[];
  };
  weather: WeatherData;
  transport: TransportMetric[];
  security: {
    activeAlerts: number;
    camerasOnline: number;
    camerasTotal: number;
  };
  medical: {
    activeIncidents: number;
    teamsAvailable: number;
    avgResponseTimeSec: number;
  };
  vendors: {
    openCount: number;
    totalCount: number;
    avgQueueMinutes: number;
  };
  sustainability: SustainabilityMetrics;
  alerts: Alert[];
}

export interface MatchInfo {
  id: string;
  teamHome: string;
  teamAway: string;
  stadium: string;
  kickoffTime: string;
  status: "scheduled" | "live" | "halftime" | "completed";
  minute: number;
  attendance: number;
  expectedAttendance: number;
}

// --- AI Chat ---

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  language?: string;
  timestamp: string;
  suggestions?: string[];
  mapRoute?: RouteDetail;
}

export interface FanContext {
  seat: string;
  gate: string;
  zone: string;
  language: string;
  dietary: string[];
  accessibility: string;
  transportPreference: TransportMode;
}

// --- AI Summary ---

export interface AISummary {
  summary: string;
  priorityActions: string[];
  riskLevel: RiskLevel;
  timestamp: string;
}

// --- Settings ---

export type UserRole =
  | "fan"
  | "volunteer"
  | "security"
  | "manager"
  | "transport"
  | "medical"
  | "vendor";

export interface UserSettings {
  role: UserRole;
  language: string;
  accessibilityMode: boolean;
  highContrast: boolean;
  reducedMotion: boolean;
  notifications: boolean;
}
