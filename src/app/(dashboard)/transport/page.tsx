"use client";

import { useCallback } from "react";
import { motion } from "framer-motion";
import {
  Bus,
  Train,
  Car,
  ParkingCircle,
  Footprints,
  Clock,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { usePolling } from "@/hooks/use-data";
import { cn, getRiskBgColor } from "@/lib/utils";
import type { TransportMetric } from "@/types";

const TRANSPORT_ICONS: Record<string, React.ElementType> = {
  metro: Train,
  bus: Bus,
  rideshare: Car,
  parking: ParkingCircle,
  walking: Footprints,
};

const STATUS_COLORS: Record<string, string> = {
  normal: "text-emerald-400",
  delayed: "text-amber-400",
  congested: "text-red-400",
  closed: "text-text-muted",
};

export default function TransportPage() {
  const { data, isLoading } = usePolling<{ transport: TransportMetric[] }>(
    useCallback(async () => {
      const res = await fetch("/api/data/transport");
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    }, []),
    30000
  );

  const transports = data?.transport ?? [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3">
          <div className="gradient-blue flex h-10 w-10 items-center justify-center rounded-xl">
            <Bus className="h-5 w-5 text-white" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-text-primary">
              Transport Intelligence
            </h1>
            <p className="text-sm text-text-secondary">
              Real-time multi-modal transport monitoring and AI routing
            </p>
          </div>
        </div>
      </motion.div>

      {/* Transport Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="glass-card p-5">
                <div className="skeleton mb-3 h-5 w-40" />
                <div className="skeleton mb-2 h-8 w-20" />
                <div className="skeleton h-3 w-full" />
              </div>
            ))
          : transports.map((t, i) => {
              const Icon = TRANSPORT_ICONS[t.mode] || Bus;

              return (
                <motion.div
                  key={`${t.mode}-${t.routeName}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass-card overflow-hidden"
                >
                  {/* Card Header */}
                  <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-3">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-text-muted" aria-hidden="true" />
                      <span className="text-sm font-semibold text-text-primary">
                        {t.routeName}
                      </span>
                    </div>
                    <span
                      className={cn(
                        "text-[10px] font-bold uppercase",
                        STATUS_COLORS[t.status]
                      )}
                    >
                      {t.status === "normal" ? "● Normal" : t.status === "delayed" ? "◐ Delayed" : t.status === "congested" ? "◉ Congested" : "○ Closed"}
                    </span>
                  </div>

                  <div className="p-5">
                    {/* Congestion Bar */}
                    <div className="mb-3">
                      <div className="mb-1 flex items-center justify-between text-xs">
                        <span className="text-text-muted">Congestion</span>
                        <span className="font-mono font-semibold text-text-primary">
                          {t.congestionLevel}%
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${t.congestionLevel}%` }}
                          transition={{ duration: 0.6 }}
                          className={cn(
                            "h-full rounded-full",
                            t.congestionLevel > 80
                              ? "bg-red-500"
                              : t.congestionLevel > 50
                              ? "bg-amber-500"
                              : "bg-emerald-500"
                          )}
                        />
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5 text-text-muted" aria-hidden="true" />
                        <div>
                          <p className="text-sm font-bold text-text-primary">
                            {t.estimatedWaitMinutes}m
                          </p>
                          <p className="text-[10px] text-text-muted">Wait time</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-3.5 w-3.5 text-text-muted" aria-hidden="true" />
                        <div>
                          <p className="text-sm font-bold text-text-primary">
                            {t.availableCapacity}
                          </p>
                          <p className="text-[10px] text-text-muted">Available</p>
                        </div>
                      </div>
                    </div>

                    {/* Details */}
                    {t.status !== "normal" && (
                      <div className="mt-3 flex items-start gap-2 rounded-lg bg-amber-500/10 px-3 py-2">
                        <AlertCircle className="mt-0.5 h-3 w-3 shrink-0 text-amber-400" aria-hidden="true" />
                        <p className="text-[11px] text-amber-300">{t.details}</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
      </div>

      {/* AI Advice Box */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card overflow-hidden"
      >
        <div className="border-b border-white/[0.06] px-5 py-3">
          <h3 className="text-sm font-semibold text-text-primary">
            🧠 AI Transport Recommendation
          </h3>
        </div>
        <div className="p-5">
          <p className="text-sm leading-relaxed text-text-secondary">
            Based on current congestion patterns,{" "}
            <strong className="text-accent-blue">leave via Gate D</strong> and take the{" "}
            <strong className="text-accent-blue">NJ Transit Meadowlands Line</strong> for
            the fastest exit. Current wait time is{" "}
            {transports.find((t) => t.mode === "metro")?.estimatedWaitMinutes ?? "~8"}{" "}
            minutes. Avoid Parking Lot A — congestion at{" "}
            {transports.find((t) => t.routeName.includes("Lot A"))?.congestionLevel ?? "75"}%.
            If driving, depart 5 minutes before the final whistle to save approximately 20
            minutes.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
