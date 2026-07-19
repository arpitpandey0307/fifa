"use client";

// ============================================================================
// FIFA Nexus AI — Error Boundary Component
// Catches rendering errors in child components and displays a recovery UI.
// Prevents full-page crashes during runtime errors.
// ============================================================================

import React, { Component, type ErrorInfo, type ReactNode } from "react";

/** Props for the ErrorBoundary component. */
interface ErrorBoundaryProps {
  /** Child components to wrap with error protection. */
  children: ReactNode;
  /** Optional custom fallback UI when an error occurs. */
  fallback?: ReactNode;
}

/** Internal state for error tracking. */
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * React Error Boundary that catches rendering errors in child components.
 * Displays a recovery UI instead of crashing the entire application.
 *
 * @example
 * ```tsx
 * <ErrorBoundary>
 *   <DashboardWidget />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  /** Reset the error state to allow retry. */
  private handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          role="alert"
          aria-live="assertive"
          className="flex flex-col items-center justify-center gap-4 rounded-lg border border-red-500/30 bg-red-500/10 p-8 text-center"
        >
          <h2 className="text-lg font-semibold text-red-400">
            Something went wrong
          </h2>
          <p className="text-sm text-slate-400">
            {this.state.error?.message || "An unexpected error occurred."}
          </p>
          <button
            onClick={this.handleReset}
            className="rounded-md bg-accent-blue px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-blue/80 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:ring-offset-2"
            aria-label="Try again to recover from error"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
