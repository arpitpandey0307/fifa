"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  ShieldAlert,
  HeartPulse,
  Zap,
  Droplets,
  Thermometer,
  Wind,
  CloudSun,
  ParkingCircle,
} from "lucide-react";
import { StatCard, StatCardSkeleton } from "@/components/dashboard/stat-card";
import { AISummaryCard } from "@/components/dashboard/ai-summary-card";
import { AlertFeed } from "@/components/dashboard/alert-feed";
import { ZoneHeatmap } from "@/components/dashboard/zone-heatmap";
import { usePolling } from "@/hooks/use-data";
import { formatNumber, formatPercent } from "@/lib/utils";
import type { DashboardData, AISummary } from "@/types";

export default function CommandCenterPage() {
  const {
    data: dashboard,
    isLoading,
  } = usePolling<DashboardData>(
    useCallback(async () => {
      const res = await fetch("/api/data/dashboard");
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    }, []),
    30000
  );

  const [aiSummary, setAiSummary] = useState<AISummary | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(true);

  // Fetch AI summary separately (slower, AI-generated)
  useEffect(() => {
    async function fetchSummary() {
      setSummaryLoading(true);
      try {
        const res = await fetch("/api/ai/summary");
        if (res.ok) {
          const data = await res.json();
          setAiSummary(data);
        }
      } catch (err) {
        console.error("Failed to fetch AI summary:", err);
      } finally {
        setSummaryLoading(false);
      }
    }

    fetchSummary();
    const interval = setInterval(fetchSummary, 60000); // refresh every 60s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl font-bold tracking-tight text-text-primary">
          AI Command Center
        </h1>
        <p className="text-sm text-text-secondary">
          Real-time stadium operations powered by Gemini AI
          {dashboard?.match && (
            <span className="ml-2 font-medium text-accent-blue">
              • {dashboard.match.teamHome} vs {dashboard.match.teamAway}
              {dashboard.match.status === "live" &&
                ` — ${dashboard.match.minute}'`}
            </span>
          )}
        </p>
      </motion.div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => <StatCardSkeleton key={i} />)
        ) : dashboard ? (
          <>
            <StatCard
              title="Attendance"
              value={formatNumber(dashboard.match.attendance)}
              subtitle={`of ${formatNumber(dashboard.match.expectedAttendance)} capacity`}
              icon={<Users className="h-5 w-5" />}
              trend={{
                value: formatPercent(dashboard.crowd.totalOccupancy),
                direction: dashboard.crowd.totalOccupancy > 85 ? "up" : "stable",
              }}
              color="blue"
            />
            <StatCard
              title="Parking"
              value={`${dashboard.transport.find((t) => t.mode === "parking")?.congestionLevel ?? 0}%`}
              subtitle="Lot occupancy"
              icon={<ParkingCircle className="h-5 w-5" />}
              trend={{ value: "steady", direction: "stable" }}
              color="purple"
            />
            <StatCard
              title="Security Alerts"
              value={dashboard.security.activeAlerts}
              subtitle={`${dashboard.security.camerasOnline}/${dashboard.security.camerasTotal} cameras online`}
              icon={<ShieldAlert className="h-5 w-5" />}
              color="amber"
            />
            <StatCard
              title="Medical Active"
              value={dashboard.medical.activeIncidents}
              subtitle={`${dashboard.medical.teamsAvailable} teams available`}
              icon={<HeartPulse className="h-5 w-5" />}
              color="red"
            />
            <StatCard
              title="Energy"
              value={`${formatNumber(dashboard.sustainability.electricityKwh)} kWh`}
              subtitle={`Solar: ${formatNumber(dashboard.sustainability.solarGenerationKwh)} kWh`}
              icon={<Zap className="h-5 w-5" />}
              color="green"
            />
          </>
        ) : null}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: Heatmap */}
        <div className="lg:col-span-1">
          {dashboard ? (
            <ZoneHeatmap zones={dashboard.crowd.zones} />
          ) : (
            <div className="glass-card h-80 skeleton" />
          )}
        </div>

        {/* Center: AI Summary */}
        <div className="lg:col-span-1">
          <AISummaryCard summary={aiSummary} isLoading={summaryLoading} />
        </div>

        {/* Right: Weather + Transport */}
        <div className="space-y-4 lg:col-span-1">
          {/* Weather Widget */}
          {dashboard && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card p-4"
            >
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-muted">
                Weather
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <Thermometer className="h-4 w-4 text-amber-400" aria-hidden="true" />
                  <div>
                    <p className="text-lg font-bold">{dashboard.weather.temperatureC}°C</p>
                    <p className="text-[10px] text-text-muted">
                      Feels like {dashboard.weather.feelsLikeC}°C
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <CloudSun className="h-4 w-4 text-cyan-400" aria-hidden="true" />
                  <div>
                    <p className="text-sm font-semibold">{dashboard.weather.conditions}</p>
                    <p className="text-[10px] text-text-muted">
                      UV: {dashboard.weather.uvIndex}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Wind className="h-4 w-4 text-blue-400" aria-hidden="true" />
                  <div>
                    <p className="text-sm font-semibold">
                      {dashboard.weather.windSpeedKmh} km/h
                    </p>
                    <p className="text-[10px] text-text-muted">
                      {dashboard.weather.windDirection}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Droplets className="h-4 w-4 text-blue-300" aria-hidden="true" />
                  <div>
                    <p className="text-sm font-semibold">{dashboard.weather.humidity}%</p>
                    <p className="text-[10px] text-text-muted">Humidity</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Vendor Status */}
          {dashboard && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="glass-card p-4"
            >
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-muted">
                Vendors
              </h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-bold">
                    {dashboard.vendors.openCount}/{dashboard.vendors.totalCount}
                  </p>
                  <p className="text-[10px] text-text-muted">Open vendors</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">
                    {dashboard.vendors.avgQueueMinutes}m
                  </p>
                  <p className="text-[10px] text-text-muted">Avg queue wait</p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Alert Feed */}
      {dashboard && <AlertFeed alerts={dashboard.alerts} />}
    </div>
  );
}
