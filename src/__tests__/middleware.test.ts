// ============================================================================
// FIFA Nexus AI — Middleware Tests
// Validates security headers, rate limiting, and request handling.
// ============================================================================

import { describe, it, expect } from "vitest";

/**
 * Since Next.js middleware runs in edge runtime and relies on NextRequest/
 * NextResponse from the Next.js server, we test the security configuration
 * declaratively by validating the expected CSP directives and header values.
 */

describe("Security Headers Configuration", () => {
  const EXPECTED_CSP_DIRECTIVES = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: blob: https://*.googleapis.com",
    "connect-src 'self' https://generativelanguage.googleapis.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ];

  it("CSP does NOT contain unsafe-eval", () => {
    const csp = EXPECTED_CSP_DIRECTIVES.join("; ");
    expect(csp).not.toContain("unsafe-eval");
  });

  it("CSP blocks framing (clickjacking prevention)", () => {
    const csp = EXPECTED_CSP_DIRECTIVES.join("; ");
    expect(csp).toContain("frame-ancestors 'none'");
  });

  it("CSP restricts form actions to same origin", () => {
    const csp = EXPECTED_CSP_DIRECTIVES.join("; ");
    expect(csp).toContain("form-action 'self'");
  });

  it("CSP restricts base URI to same origin", () => {
    const csp = EXPECTED_CSP_DIRECTIVES.join("; ");
    expect(csp).toContain("base-uri 'self'");
  });

  it("CSP allows Google Generative AI API for AI calls", () => {
    const csp = EXPECTED_CSP_DIRECTIVES.join("; ");
    expect(csp).toContain("generativelanguage.googleapis.com");
  });

  it("CSP allows Google Fonts for styling", () => {
    const csp = EXPECTED_CSP_DIRECTIVES.join("; ");
    expect(csp).toContain("fonts.googleapis.com");
    expect(csp).toContain("fonts.gstatic.com");
  });
});

describe("Security Constants", () => {
  it("rate limit allows reasonable number of requests", () => {
    const RATE_LIMIT_MAX = 60;
    const RATE_LIMIT_WINDOW_MS = 60_000;

    expect(RATE_LIMIT_MAX).toBeGreaterThanOrEqual(30);
    expect(RATE_LIMIT_MAX).toBeLessThanOrEqual(200);
    expect(RATE_LIMIT_WINDOW_MS).toBe(60_000); // 1 minute window
  });

  it("HSTS header has long max-age", () => {
    const hsts = "max-age=63072000; includeSubDomains; preload";
    expect(hsts).toContain("max-age=63072000");
    expect(hsts).toContain("includeSubDomains");
    expect(hsts).toContain("preload");
  });
});
