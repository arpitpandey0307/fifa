// ============================================================================
// FIFA Nexus AI — Utility Functions
// Pure utility functions for formatting, styling, security, and math.
// All functions are side-effect free and thoroughly tested.
// ============================================================================

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge and deduplicate Tailwind CSS class names with conflict resolution.
 * Combines `clsx` (conditional classes) with `tailwind-merge` (conflict resolution).
 *
 * @param inputs - Class values (strings, arrays, objects, conditionals).
 * @returns Merged class string with Tailwind conflicts resolved.
 *
 * @example
 * ```ts
 * cn("px-4", "px-8")           // "px-8" (conflict resolved)
 * cn("base", false && "hidden") // "base" (conditional)
 * ```
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Format a number with locale-appropriate thousand separators.
 *
 * @param value - The numeric value to format.
 * @param decimals - Number of decimal places (default: 0).
 * @returns Formatted string (e.g., `"78,542"` or `"1,234.57"`).
 */
export function formatNumber(value: number, decimals = 0): string {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Format a percentage value with one decimal place.
 *
 * @param value - The percentage value.
 * @param showSign - If `true`, prefix positive values with `+`.
 * @returns Formatted percentage string (e.g., `"78.5%"` or `"+5.2%"`).
 */
export function formatPercent(value: number, showSign = false): string {
  const formatted = `${value.toFixed(1)}%`;
  if (showSign && value > 0) return `+${formatted}`;
  return formatted;
}

/**
 * Format an ISO timestamp to a 24-hour time string.
 *
 * @param timestamp - ISO 8601 timestamp string.
 * @returns Formatted time (e.g., `"14:35:22"`).
 */
export function formatTime(timestamp: string): string {
  return new Date(timestamp).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

/**
 * Format a timestamp as a human-readable relative time string.
 *
 * @param timestamp - ISO 8601 timestamp string.
 * @returns Relative time (e.g., `"just now"`, `"30s ago"`, `"5m ago"`, `"2h ago"`).
 */
export function formatRelativeTime(timestamp: string): string {
  const now = Date.now();
  const diff = now - new Date(timestamp).getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (seconds < 10) return "just now";
  if (seconds < 60) return `${seconds}s ago`;
  if (minutes < 60) return `${minutes}m ago`;
  return `${hours}h ago`;
}

/**
 * Get the Tailwind text color class for a crowd risk level.
 *
 * @param level - Risk level string (low, medium, high, critical).
 * @returns Tailwind CSS class for the corresponding text color.
 */
export function getRiskColor(level: string): string {
  switch (level) {
    case "low":
      return "text-emerald-400";
    case "medium":
      return "text-amber-400";
    case "high":
      return "text-orange-400";
    case "critical":
      return "text-red-400";
    default:
      return "text-slate-400";
  }
}

/**
 * Get the Tailwind background + border classes for a risk level badge.
 *
 * @param level - Risk level string (low, medium, high, critical).
 * @returns Combined background and border CSS classes.
 */
export function getRiskBgColor(level: string): string {
  switch (level) {
    case "low":
      return "bg-emerald-500/20 border-emerald-500/30";
    case "medium":
      return "bg-amber-500/20 border-amber-500/30";
    case "high":
      return "bg-orange-500/20 border-orange-500/30";
    case "critical":
      return "bg-red-500/20 border-red-500/30";
    default:
      return "bg-slate-500/20 border-slate-500/30";
  }
}

/**
 * Get the emoji icon for an alert severity level.
 *
 * @param severity - Alert severity (info, warning, critical, emergency).
 * @returns Emoji string representing the severity.
 */
export function getSeverityIcon(severity: string): string {
  switch (severity) {
    case "info":
      return "ℹ️";
    case "warning":
      return "⚠️";
    case "critical":
      return "🔴";
    case "emergency":
      return "🚨";
    default:
      return "📋";
  }
}

/**
 * Generate a unique identifier using timestamp and random characters.
 * Not cryptographically secure — suitable for UI element keys.
 *
 * @returns A unique string ID (e.g., `"1721345678901-k4f8m2q"`).
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Clamp a numeric value within a minimum and maximum range.
 *
 * @param value - The value to clamp.
 * @param min - Minimum allowed value.
 * @param max - Maximum allowed value.
 * @returns The clamped value.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Linearly interpolate between two values.
 * The parameter `t` is clamped to [0, 1].
 *
 * @param a - Start value.
 * @param b - End value.
 * @param t - Interpolation factor (0 = a, 1 = b).
 * @returns The interpolated value.
 */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * clamp(t, 0, 1);
}

/**
 * Sanitize user input to prevent Cross-Site Scripting (XSS) attacks.
 * Escapes HTML entities, trims whitespace, and enforces a 2000-character limit.
 *
 * @param input - Raw user input string.
 * @returns Sanitized string safe for rendering.
 *
 * @example
 * ```ts
 * sanitizeInput('<script>alert("xss")</script>')
 * // Returns: '&lt;script&gt;alert(&amp;#x27;xss&amp;#x27;)&lt;/script&gt;'
 * ```
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .trim()
    .slice(0, 2000);
}
