"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Users, TrendingUp, Brain, RefreshCw } from "lucide-react";
import { useCrowdData } from "@/hooks/use-data";
import { cn, formatPercent, getRiskColor, getRiskBgColor } from "@/lib/utils";
import type { CrowdPrediction, CrowdMetric } from "@/types";

export default function CrowdPage() {
  const { data, isLoading } = useCrowdData();
  const [predictions, setPredictions] = useState<CrowdPrediction[] | null>(null);
  const [predicting, setPredicting] = useState(false);

  const fetchPredictions = useCallback(async () => {
    setPredicting(true);
    try {
      const res = await fetch("/api/ai/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ zoneIds: [] }),
      });
      if (res.ok) {
        const result = await res.json();
        setPredictions(result.predictions);
      }
    } catch (err) {
      console.error("Prediction error:", err);
    } finally {
      setPredicting(false);
    }
  }, []);

  const zones: CrowdMetric[] = data?.zones ?? [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">
            Crowd Intelligence
          </h1>
          <p className="text-sm text-text-secondary">
            AI-powered crowd density monitoring and prediction
          </p>
        </div>
        <button
          onClick={fetchPredictions}
          disabled={predicting}
          className="gradient-blue flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
          aria-label="Generate AI predictions"
        >
          {predicting ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <Brain className="h-4 w-4" />
          )}
          {predicting ? "Predicting..." : "Generate AI Predictions"}
        </button>
      </motion.div>

      {/* Zone Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="glass-card p-4">
                <div className="skeleton mb-3 h-4 w-24" />
                <div className="skeleton mb-2 h-8 w-16" />
                <div className="skeleton h-3 w-full" />
              </div>
            ))
          : zones
              .filter((z) =>
                ["NS-A", "NS-B", "SS-A", "SS-B", "ES", "WS", "FC-N", "FC-S"].includes(z.zoneCode)
              )
              .map((zone, i) => {
                const prediction = predictions?.find(
                  (p) => p.zoneCode === zone.zoneCode
                );

                return (
                  <motion.div
                    key={zone.zoneId}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.3 }}
                    className="glass-card overflow-hidden"
                  >
                    {/* Zone Header */}
                    <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-text-muted" aria-hidden="true" />
                        <span className="text-sm font-semibold text-text-primary">
                          {zone.zoneName}
                        </span>
                      </div>
                      <span
                        className={cn(
                          "rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase",
                          getRiskBgColor(zone.riskLevel)
                        )}
                      >
                        {zone.riskLevel}
                      </span>
                    </div>

                    {/* Density */}
                    <div className="px-4 py-3">
                      <div className="mb-2 flex items-end justify-between">
                        <span
                          className={cn(
                            "text-3xl font-bold",
                            getRiskColor(zone.riskLevel)
                          )}
                        >
                          {zone.densityPercent}%
                        </span>
                        <div className="flex items-center gap-1 text-xs text-text-muted">
                          <TrendingUp className="h-3 w-3" aria-hidden="true" />
                          <span>{zone.trend}</span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${zone.densityPercent}%` }}
                          transition={{ duration: 0.6, ease: "easeOut" }}
                          className={cn(
                            "h-full rounded-full",
                            zone.riskLevel === "critical"
                              ? "bg-red-500"
                              : zone.riskLevel === "high"
                              ? "bg-orange-500"
                              : zone.riskLevel === "medium"
                              ? "bg-amber-500"
                              : "bg-emerald-500"
                          )}
                        />
                      </div>

                      <p className="mt-1.5 text-[11px] text-text-muted">
                        {zone.currentCount.toLocaleString()} / {zone.capacity.toLocaleString()}
                      </p>
                    </div>

                    {/* AI Prediction */}
                    {prediction && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="border-t border-white/[0.06] bg-accent-blue/5 px-4 py-3"
                      >
                        <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-accent-blue">
                          AI Prediction
                        </p>
                        <div className="grid grid-cols-3 gap-2 text-center">
                          <div>
                            <p className="text-xs font-bold text-text-primary">
                              {prediction.predicted5min?.toFixed(0) ?? '-'}%
                            </p>
                            <p className="text-[9px] text-text-muted">+5 min</p>
                            <p className="text-[8px] text-accent-cyan">
                              ±{((1 - (prediction.confidence5min ?? 0)) * 100).toFixed(0)}%
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-bold text-text-primary">
                              {prediction.predicted10min?.toFixed(0) ?? '-'}%
                            </p>
                            <p className="text-[9px] text-text-muted">+10 min</p>
                            <p className="text-[8px] text-accent-cyan">
                              ±{((1 - (prediction.confidence10min ?? 0)) * 100).toFixed(0)}%
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-bold text-text-primary">
                              {prediction.predicted15min?.toFixed(0) ?? '-'}%
                            </p>
                            <p className="text-[9px] text-text-muted">+15 min</p>
                            <p className="text-[8px] text-accent-cyan">
                              ±{((1 - (prediction.confidence15min ?? 0)) * 100).toFixed(0)}%
                            </p>
                          </div>
                        </div>
                        {prediction.reasoning && (
                          <p className="mt-2 text-[10px] italic text-text-secondary">
                            {prediction.reasoning}
                          </p>
                        )}
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
      </div>
    </div>
  );
}
