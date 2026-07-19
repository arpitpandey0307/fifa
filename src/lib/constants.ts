// ============================================================================
// FIFA Nexus AI — Application Constants
// Centralized configuration values used across the platform.
// All constants are typed with `as const` for maximum type safety.
// ============================================================================

/** Application display name. */
export const APP_NAME = "FIFA Nexus AI";

/** Application tagline used in meta descriptions. */
export const APP_DESCRIPTION =
  "The AI Operating System for FIFA World Cup 2026 Smart Stadiums";

/** Current application version (SemVer). */
export const APP_VERSION = "1.0.0";

/**
 * Supported languages for the multilingual fan assistant.
 * Includes FIFA official languages and host country languages.
 * Each entry provides ISO 639-1 code, English name, and native script.
 */
export const SUPPORTED_LANGUAGES = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी" },
  { code: "es", name: "Spanish", nativeName: "Español" },
  { code: "fr", name: "French", nativeName: "Français" },
  { code: "ar", name: "Arabic", nativeName: "العربية", rtl: true },
  { code: "ja", name: "Japanese", nativeName: "日本語" },
  { code: "de", name: "German", nativeName: "Deutsch" },
] as const;

/**
 * Crowd density thresholds (percentage) for risk level classification.
 * Used by the simulation engine and prediction AI to categorize zones.
 *
 * - `low`: Normal operations, no action required
 * - `medium`: Increased monitoring, prepare contingency
 * - `high`: Active crowd management, deploy volunteers
 * - `critical`: Emergency protocols, restrict entry
 */
export const RISK_THRESHOLDS = {
  low: 60,
  medium: 80,
  high: 90,
  critical: 95,
} as const;

/**
 * Polling intervals (milliseconds) for real-time data fetching.
 * Each endpoint has a tailored interval based on data volatility.
 */
export const POLLING_INTERVALS = {
  /** General dashboard refresh — 30 seconds. */
  dashboard: 30_000,
  /** Crowd density updates — 15 seconds (higher frequency for safety). */
  crowd: 15_000,
  /** Alert feed updates — 10 seconds (near real-time). */
  alerts: 10_000,
  /** Transport status — 30 seconds. */
  transport: 30_000,
  /** Sustainability metrics — 60 seconds (slow-changing data). */
  sustainability: 60_000,
} as const;

/**
 * Sidebar navigation items.
 * Each item maps to a dashboard page with icon and description.
 */
export const NAV_ITEMS = [
  {
    id: "command-center",
    label: "Command Center",
    href: "/command-center",
    icon: "LayoutDashboard",
    description: "AI-powered operations overview",
  },
  {
    id: "fan-assistant",
    label: "Fan Assistant",
    href: "/fan-assistant",
    icon: "MessageSquare",
    description: "Multilingual AI assistant",
  },
  {
    id: "crowd",
    label: "Crowd Intelligence",
    href: "/crowd",
    icon: "Users",
    description: "Predictive crowd analysis",
  },
  {
    id: "incidents",
    label: "Incident Commander",
    href: "/incidents",
    icon: "AlertTriangle",
    description: "AI-triaged incident response",
  },
  {
    id: "security",
    label: "Security Copilot",
    href: "/security",
    icon: "Shield",
    description: "AI-augmented surveillance",
  },
  {
    id: "volunteers",
    label: "Volunteer Copilot",
    href: "/volunteers",
    icon: "HandHelping",
    description: "Dynamic task assignment",
  },
  {
    id: "sustainability",
    label: "Sustainability",
    href: "/sustainability",
    icon: "Leaf",
    description: "Environmental monitoring",
  },
  {
    id: "transport",
    label: "Transport AI",
    href: "/transport",
    icon: "Bus",
    description: "Smart transportation",
  },
  {
    id: "settings",
    label: "Settings",
    href: "/settings",
    icon: "Settings",
    description: "Preferences & accessibility",
  },
] as const;

/**
 * Match phase definitions used by the simulation engine.
 * Each phase has start/end minutes and a human-readable label.
 *
 * Timeline: Pre-Match (-120 to 0) → First Half (0–45) → Halftime (45–60)
 *           → Second Half (60–105) → Post-Match (105–180)
 */
export const MATCH_PHASES = {
  PRE_MATCH: { start: -120, end: 0, label: "Pre-Match" },
  FIRST_HALF: { start: 0, end: 45, label: "First Half" },
  HALFTIME: { start: 45, end: 60, label: "Halftime" },
  SECOND_HALF: { start: 60, end: 105, label: "Second Half" },
  POST_MATCH: { start: 105, end: 180, label: "Post-Match" },
} as const;
