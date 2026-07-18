import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind CSS class names with conflict resolution.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a number with locale-appropriate separators.
 */
export function formatNumber(value: number, decimals = 0): string {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Format a percentage value with optional sign.
 */
export function formatPercent(value: number, showSign = false): string {
  const formatted = `${value.toFixed(1)}%`;
  if (showSign && value > 0) return `+${formatted}`;
  return formatted;
}

/**
 * Format a timestamp to a localized time string.
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
 * Format a timestamp to a relative time string (e.g., "2 min ago").
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
 * Get color class for a risk level.
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
 * Get background color class for a risk level.
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
 * Get severity icon for alerts.
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
 * Generate a unique ID.
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Clamp a value between min and max.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Linear interpolation between two values.
 */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * clamp(t, 0, 1);
}

/**
 * Sanitize user input to prevent XSS.
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .trim()
    .slice(0, 2000); // Limit input length
}
