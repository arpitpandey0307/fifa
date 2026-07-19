// ============================================================================
// FIFA Nexus AI — TypeScript Type Definitions
// Centralized type system for all domain entities used across the platform.
// ============================================================================

// ---------------------------------------------------------------------------
// Stadium & Zones
// ---------------------------------------------------------------------------

/** Crowd density risk classification. */
export type RiskLevel = "low" | "medium" | "high" | "critical";

/** Physical zone types within the stadium. */
export type ZoneType =
  | "stand"
  | "concourse"
  | "gate"
  | "parking"
  | "food_court"
  | "medical"
  | "vip"
  | "service";

/** A physical zone within the stadium with capacity and location data. */
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

/** Stadium venue definition with zones. */
export interface Stadium {
  id: string;
  name: string;
  city: string;
  country: string;
  totalCapacity: number;
  coordinates: { lat: number; lng: number };
  zones: StadiumZone[];
}

// ---------------------------------------------------------------------------
// Crowd Intelligence
// ---------------------------------------------------------------------------

/** Real-time crowd density measurement for a single zone. */
export interface CrowdMetric {
  zoneId: string;
  zoneCode: string;
  zoneName: string;
  currentCount: number;
  capacity: number;
  /** Current occupancy as a percentage (0–100). */
  densityPercent: number;
  riskLevel: RiskLevel;
  /** People entering the zone per minute. */
  flowRateIn: number;
  /** People leaving the zone per minute. */
  flowRateOut: number;
  trend: "increasing" | "decreasing" | "stable";
  timestamp: string;
}

/** AI-generated crowd density prediction with confidence scores. */
export interface CrowdPrediction {
  zoneId: string;
  zoneCode: string;
  currentDensity: number;
  /** Predicted density in 5 minutes. */
  predicted5min: number;
  /** Predicted density in 10 minutes. */
  predicted10min: number;
  /** Predicted density in 15 minutes. */
  predicted15min: number;
  /** Confidence score for 5-min prediction (0.0–1.0). */
  confidence5min: number;
  /** Confidence score for 10-min prediction (0.0–1.0). */
  confidence10min: number;
  /** Confidence score for 15-min prediction (0.0–1.0). */
  confidence15min: number;
  riskLevel: RiskLevel;
  suggestedActions: string[];
  /** AI reasoning explaining the prediction logic. */
  reasoning: string;
  timestamp: string;
}

// ---------------------------------------------------------------------------
// Transport
// ---------------------------------------------------------------------------

/** Available transport modes around the stadium. */
export type TransportMode = "metro" | "bus" | "rideshare" | "parking" | "walking";

/** Operational status of a transport route. */
export type TransportStatus = "normal" | "delayed" | "congested" | "closed";

/** Real-time metrics for a single transport route. */
export interface TransportMetric {
  mode: TransportMode;
  routeName: string;
  status: TransportStatus;
  /** Congestion level as a percentage (0–100). */
  congestionLevel: number;
  estimatedWaitMinutes: number;
  availableCapacity: number;
  details: string;
}

/** AI-generated transport departure recommendation. */
export interface TransportRecommendation {
  bestExitGate: string;
  bestRoute: RouteDetail;
  leastCrowdedRoute: RouteDetail;
  recommendedDepartureTime: string;
  reasoning: string;
}

/** Detailed route information for navigation. */
export interface RouteDetail {
  path: string[];
  distanceM: number;
  durationMinutes: number;
  transportMode: TransportMode;
  crowdLevel: RiskLevel;
}

// ---------------------------------------------------------------------------
// Incidents & Emergency Response
// ---------------------------------------------------------------------------

/** Classification of incident types. */
export type IncidentType =
  | "medical"
  | "security"
  | "fire"
  | "structural"
  | "crowd"
  | "weather"
  | "other";

/** Severity levels for incident classification. */
export type IncidentSeverity = "low" | "medium" | "high" | "critical";

/** Lifecycle status of an incident. */
export type IncidentStatus =
  | "reported"
  | "triaged"
  | "dispatched"
  | "in_progress"
  | "resolved";

/** Full incident record with AI analysis and response data. */
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

/** Result of AI-powered incident triage with dispatch recommendation. */
export interface IncidentTriageResult {
  incidentType: IncidentType;
  severity: IncidentSeverity;
  /** Human-readable location extracted from the report. */
  extractedLocation: string;
  /** Stadium zone code where the incident occurred. */
  zoneId: string;
  nearestResponder: {
    teamId: string;
    currentLocation: string;
    estimatedArrivalMinutes: number;
  };
  /** Current crowd density at the incident location (percentage). */
  crowdLevelAtLocation: number;
  /** Ordered waypoints for the fastest response route. */
  fastestRoute: string[];
  /** AI-generated dispatch instructions. */
  dispatchRecommendation: string;
  /** Additional follow-up actions recommended by AI. */
  additionalActions: string[];
}

// ---------------------------------------------------------------------------
// Food Vendors
// ---------------------------------------------------------------------------

/** Food vendor with menu, queue, and accessibility information. */
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

// ---------------------------------------------------------------------------
// Sustainability
// ---------------------------------------------------------------------------

/** Environmental metrics for FIFA Green Card compliance tracking. */
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

// ---------------------------------------------------------------------------
// Weather
// ---------------------------------------------------------------------------

/** Current weather conditions at the stadium. */
export interface WeatherData {
  temperatureC: number;
  /** Relative humidity percentage (0–100). */
  humidity: number;
  windSpeedKmh: number;
  windDirection: string;
  conditions: string;
  uvIndex: number;
  precipitationMm: number;
  feelsLikeC: number;
}

// ---------------------------------------------------------------------------
// Alerts
// ---------------------------------------------------------------------------

/** Alert categories for the stadium alert system. */
export type AlertType =
  | "crowd"
  | "security"
  | "medical"
  | "weather"
  | "transport"
  | "sustainability"
  | "system";

/** Alert urgency levels. */
export type AlertSeverity = "info" | "warning" | "critical" | "emergency";

/** A real-time alert with optional AI recommendation. */
export interface Alert {
  id: string;
  type: AlertType;
  severity: AlertSeverity;
  title: string;
  message: string;
  /** AI-generated recommended action for this alert. */
  aiRecommendation?: string;
  /** Stadium zone code related to this alert. */
  zone?: string;
  timestamp: string;
  acknowledged: boolean;
}

// ---------------------------------------------------------------------------
// Dashboard
// ---------------------------------------------------------------------------

/** Aggregated dashboard data combining all real-time metrics. */
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

/** Current match information and status. */
export interface MatchInfo {
  id: string;
  teamHome: string;
  teamAway: string;
  stadium: string;
  kickoffTime: string;
  status: "scheduled" | "live" | "halftime" | "completed";
  /** Current match minute (0 = kickoff, 45 = halftime, etc.). */
  minute: number;
  attendance: number;
  expectedAttendance: number;
}

// ---------------------------------------------------------------------------
// AI Chat
// ---------------------------------------------------------------------------

/** A single message in the AI chat conversation. */
export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  /** Detected language of the message. */
  language?: string;
  timestamp: string;
  /** AI-suggested follow-up questions. */
  suggestions?: string[];
  /** Optional navigation route attached to the response. */
  mapRoute?: RouteDetail;
}

/** Fan context passed to the AI for personalized responses. */
export interface FanContext {
  seat: string;
  gate: string;
  zone: string;
  /** ISO 639-1 language code. */
  language: string;
  dietary: string[];
  accessibility: string;
  transportPreference: TransportMode;
}

// ---------------------------------------------------------------------------
// AI Summary
// ---------------------------------------------------------------------------

/** AI-generated operational summary for the command center. */
export interface AISummary {
  summary: string;
  priorityActions: string[];
  riskLevel: RiskLevel;
  timestamp: string;
}

// ---------------------------------------------------------------------------
// User Settings
// ---------------------------------------------------------------------------

/** Available user roles in the platform. */
export type UserRole =
  | "fan"
  | "volunteer"
  | "security"
  | "manager"
  | "transport"
  | "medical"
  | "vendor";

/** User preferences for role, language, and accessibility. */
export interface UserSettings {
  role: UserRole;
  /** ISO 639-1 language code. */
  language: string;
  /** Enable screen reader optimizations. */
  accessibilityMode: boolean;
  /** Enable high-contrast visual mode. */
  highContrast: boolean;
  /** Minimize animations for vestibular sensitivity. */
  reducedMotion: boolean;
  /** Enable real-time push notifications. */
  notifications: boolean;
}
