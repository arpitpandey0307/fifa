// ============================================================================
// FIFA Nexus AI — App Constants
// ============================================================================

export const APP_NAME = "FIFA Nexus AI";
export const APP_DESCRIPTION =
  "The AI Operating System for FIFA World Cup 2026 Smart Stadiums";
export const APP_VERSION = "1.0.0";

/**
 * Supported languages with display names.
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
 * Risk level thresholds for crowd density.
 */
export const RISK_THRESHOLDS = {
  low: 60,
  medium: 80,
  high: 90,
  critical: 95,
} as const;

/**
 * Polling intervals for real-time data (milliseconds).
 */
export const POLLING_INTERVALS = {
  dashboard: 30_000, // 30 seconds
  crowd: 15_000, // 15 seconds
  alerts: 10_000, // 10 seconds
  transport: 30_000, // 30 seconds
  sustainability: 60_000, // 1 minute
} as const;

/**
 * Navigation items for sidebar.
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
 * Match phases used by simulator.
 */
export const MATCH_PHASES = {
  PRE_MATCH: { start: -120, end: 0, label: "Pre-Match" },
  FIRST_HALF: { start: 0, end: 45, label: "First Half" },
  HALFTIME: { start: 45, end: 60, label: "Halftime" },
  SECOND_HALF: { start: 60, end: 105, label: "Second Half" },
  POST_MATCH: { start: 105, end: 180, label: "Post-Match" },
} as const;
