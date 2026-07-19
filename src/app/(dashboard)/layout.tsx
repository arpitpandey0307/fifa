"use client";

// ============================================================================
// FIFA Nexus AI — Dashboard Layout
// Shared layout for all dashboard pages with sidebar navigation,
// topbar, error boundary, and responsive grid structure.
// ============================================================================

import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { ErrorBoundary } from "@/components/error-boundary";

/**
 * Dashboard layout wrapping all feature pages.
 * Provides consistent sidebar navigation, topbar, and error recovery.
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="gradient-mesh flex min-h-screen">
      <Sidebar />
      <main
        className="ml-[260px] flex flex-1 flex-col transition-all duration-250"
        role="main"
        aria-label="Dashboard content area"
      >
        <Topbar />
        <div className="flex-1 p-6">
          <ErrorBoundary>{children}</ErrorBoundary>
        </div>
      </main>
    </div>
  );
}
