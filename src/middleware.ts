// ============================================================================
// FIFA Nexus AI — Next.js Middleware
// Security headers, rate limiting, and request validation for all routes.
// ============================================================================

import { NextResponse, type NextRequest } from "next/server";

// --------------------------------------------------------------------------
// Simple in-memory rate limiter (per-IP, sliding window)
// --------------------------------------------------------------------------

/** Maximum number of API requests allowed per window. */
const RATE_LIMIT_MAX_REQUESTS = 60;

/** Duration of the rate-limiting window in milliseconds (1 minute). */
const RATE_LIMIT_WINDOW_MS = 60_000;

/** Tracks per-IP request counts and their window reset timestamps. */
const ipRequestCounts = new Map<string, { count: number; resetAt: number }>();

/**
 * Check whether a given IP address has exceeded the rate limit.
 * Automatically resets the counter when the window expires.
 *
 * @param ip - The client IP address to check.
 * @returns `true` if the IP is rate-limited, `false` otherwise.
 */
function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = ipRequestCounts.get(ip);

  if (!entry || now > entry.resetAt) {
    ipRequestCounts.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  entry.count++;
  return entry.count > RATE_LIMIT_MAX_REQUESTS;
}

/**
 * Periodically evict stale entries to prevent unbounded memory growth.
 * Runs every 5 minutes in server-side environments.
 */
if (typeof globalThis !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [ip, entry] of ipRequestCounts) {
      if (now > entry.resetAt) ipRequestCounts.delete(ip);
    }
  }, 5 * 60_000);
}

// --------------------------------------------------------------------------
// Security Headers
// --------------------------------------------------------------------------

/**
 * Content Security Policy — restricts resource loading origins.
 * `unsafe-inline` is required for Next.js style injection; `unsafe-eval` is
 * intentionally omitted to mitigate XSS via `eval()`.
 */
const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data: blob: https://*.googleapis.com",
  "connect-src 'self' https://generativelanguage.googleapis.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

/**
 * Apply a comprehensive set of security headers to every response.
 */
function applySecurityHeaders(response: NextResponse): void {
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains; preload"
  );
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(self)"
  );
  response.headers.set("Content-Security-Policy", CONTENT_SECURITY_POLICY);
}

// --------------------------------------------------------------------------
// Middleware Handler
// --------------------------------------------------------------------------

/**
 * Next.js edge middleware executed on every matched request.
 *
 * - Rate-limits API routes (429 on excess).
 * - Attaches security headers to all responses.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rate limit API routes only
  if (pathname.startsWith("/api/")) {
    const forwarded = request.headers.get("x-forwarded-for");
    const ip =
      (forwarded ? forwarded.split(",")[0]?.trim() : null) ??
      request.headers.get("x-real-ip") ??
      "unknown";

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }
  }

  // Attach security headers to all responses
  const response = NextResponse.next();
  applySecurityHeaders(response);

  return response;
}

export const config = {
  matcher: [
    // Match all routes except static files and Next.js internals
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
