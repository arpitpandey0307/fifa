"use client";

import { useCallback } from "react";
import { motion } from "framer-motion";
import {
  Leaf,
  Zap,
  Droplets,
  Trash2,
  Factory,
  Sun,
  Recycle,
  TrendingDown,
} from "lucide-react";
import { usePolling } from "@/hooks/use-data";
import { formatNumber } from "@/lib/utils";
import { StatCard } from "@/components/dashboard/stat-card";
import type { SustainabilityMetrics } from "@/types";

export default function SustainabilityPage() {
  const { data, isLoading } = usePolling<SustainabilityMetrics>(
    useCallback(async () => {
      const res = await fetch("/api/data/sustainability");
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    }, []),
    60000
  );

  const solarPercent = data
    ? Math.round((data.solarGenerationKwh / Math.max(1, data.electricityKwh)) * 100)
    : 0;

  const recycleRate = data
    ? Math.round(
        (data.recycledKg /
          Math.max(1, data.plasticWasteKg + data.foodWasteKg + data.generalWasteKg)) *
          100
      )
    : 0;

  const waterRecycleRate = data
    ? Math.round((data.recycledWaterLiters / Math.max(1, data.waterLiters)) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3">
          <div className="gradient-success flex h-10 w-10 items-center justify-center rounded-xl">
            <Leaf className="h-5 w-5 text-white" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-text-primary">
              Sustainability Dashboard
            </h1>
            <p className="text-sm text-text-secondary">
              Real-time environmental monitoring • FIFA Green Card compliance
            </p>
          </div>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          title="Electricity"
          value={data ? `${formatNumber(data.electricityKwh)}` : "—"}
          subtitle="kWh consumed"
          icon={<Zap className="h-5 w-5" />}
          color="amber"
        />
        <StatCard
          title="Solar Generation"
          value={data ? `${formatNumber(data.solarGenerationKwh)}` : "—"}
          subtitle={`${solarPercent}% of total consumption`}
          icon={<Sun className="h-5 w-5" />}
          trend={{ value: `${solarPercent}%`, direction: "up" }}
          color="green"
        />
        <StatCard
          title="Water Usage"
          value={data ? `${formatNumber(data.waterLiters)}` : "—"}
          subtitle={`${waterRecycleRate}% recycled`}
          icon={<Droplets className="h-5 w-5" />}
          color="blue"
        />
        <StatCard
          title="Carbon Footprint"
          value={data ? `${formatNumber(data.carbonFootprintKgCo2)}` : "—"}
          subtitle="kg CO₂ emitted"
          icon={<Factory className="h-5 w-5" />}
          trend={{ value: "monitoring", direction: "stable" }}
          color="purple"
        />
      </div>

      {/* Waste Management */}
      <div className="grid gap-4 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-5"
        >
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-text-primary">
            <Trash2 className="h-4 w-4 text-amber-400" aria-hidden="true" />
            Waste Management
          </h3>
          <div className="space-y-4">
            {data && [
              { label: "Plastic Waste", value: data.plasticWasteKg, color: "bg-amber-500", max: 200 },
              { label: "Food Waste", value: data.foodWasteKg, color: "bg-orange-500", max: 150 },
              { label: "General Waste", value: data.generalWasteKg, color: "bg-red-400", max: 300 },
            ].map((item) => (
              <div key={item.label}>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="text-text-secondary">{item.label}</span>
                  <span className="font-mono font-semibold text-text-primary">
                    {formatNumber(item.value, 1)} kg
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, (item.value / item.max) * 100)}%` }}
                    transition={{ duration: 0.6 }}
                    className={`h-full rounded-full ${item.color}`}
                  />
                </div>
              </div>
            ))}
          </div>
          {data && (
            <div className="mt-4 flex items-center gap-2 rounded-lg bg-emerald-500/10 px-3 py-2">
              <Recycle className="h-4 w-4 text-emerald-400" aria-hidden="true" />
              <span className="text-xs text-emerald-400">
                <strong>{recycleRate}%</strong> recycling rate • {formatNumber(data.recycledKg, 1)} kg recycled
              </span>
            </div>
          )}
        </motion.div>

        {/* AI Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass-card p-5"
        >
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-text-primary">
            <TrendingDown className="h-4 w-4 text-emerald-400" aria-hidden="true" />
            AI Optimization Recommendations
          </h3>
          <div className="space-y-3">
            {[
              {
                category: "Energy",
                action: "Reduce HVAC in East Stand by 15% — temperature is within comfort range",
                savings: "~120 kWh savings",
                priority: "high",
              },
              {
                category: "Water",
                action: "Switch to gray water for concourse cleaning during second half",
                savings: "~500L savings",
                priority: "medium",
              },
              {
                category: "Waste",
                action: "Deploy additional recycling bins near North Food Court — overflow detected",
                savings: "+8% recycling rate",
                priority: "high",
              },
              {
                category: "Carbon",
                action: "Enable solar priority mode for LED lighting system",
                savings: "~45 kg CO₂ reduction",
                priority: "medium",
              },
            ].map((rec, i) => (
              <div
                key={i}
                className="rounded-lg border border-white/[0.06] p-3 transition-colors hover:border-emerald-500/20"
              >
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                    {rec.category}
                  </span>
                  <span className="rounded-full bg-white/[0.04] px-2 py-0.5 text-[9px] font-semibold uppercase text-text-muted">
                    {rec.priority}
                  </span>
                </div>
                <p className="text-xs text-text-secondary">{rec.action}</p>
                <p className="mt-1 text-[10px] font-semibold text-accent-cyan">{rec.savings}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
