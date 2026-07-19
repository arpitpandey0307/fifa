// ============================================================================
// FIFA Nexus AI — Error Boundary Tests
// Validates error recovery behavior.
// ============================================================================

import { describe, it, expect } from "vitest";

describe("ErrorBoundary Component", () => {
  it("module exports ErrorBoundary class", async () => {
    const mod = await import("@/components/error-boundary");
    expect(mod.ErrorBoundary).toBeDefined();
    expect(typeof mod.ErrorBoundary).toBe("function");
  });

  it("ErrorBoundary is a React component (has render method)", async () => {
    const { ErrorBoundary } = await import("@/components/error-boundary");
    expect(ErrorBoundary.prototype.render).toBeDefined();
  });

  it("has getDerivedStateFromError static method", async () => {
    const { ErrorBoundary } = await import("@/components/error-boundary");
    expect(ErrorBoundary.getDerivedStateFromError).toBeDefined();
  });

  it("getDerivedStateFromError returns error state", async () => {
    const { ErrorBoundary } = await import("@/components/error-boundary");
    const error = new Error("Test error");
    const state = ErrorBoundary.getDerivedStateFromError(error);
    expect(state.hasError).toBe(true);
    expect(state.error).toBe(error);
  });
});
