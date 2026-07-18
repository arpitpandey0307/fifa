"use client";

import { cn } from "@/lib/utils";
import type { CrowdMetric } from "@/types";

interface ZoneHeatmapProps {
  zones: CrowdMetric[];
}

const riskColors: Record<string, string> = {
  low: "bg-emerald-500",
  medium: "bg-amber-500",
  high: "bg-orange-500",
  critical: "bg-red-500",
};

const riskGlow: Record<string, string> = {
  low: "",
  medium: "",
  high: "shadow-[0_0_12px_rgba(249,115,22,0.3)]",
  critical: "shadow-[0_0_16px_rgba(239,68,68,0.4)] animate-pulse",
};

/**
 * Simplified stadium heatmap showing zone densities as a grid.
 */
export function ZoneHeatmap({ zones }: ZoneHeatmapProps) {
  // Filter to main spectator zones
  const stands = zones.filter((z) =>
    ["NS-A", "NS-B", "SS-A", "SS-B", "ES", "WS", "VIP"].includes(z.zoneCode)
  );
  const gates = zones.filter((z) => z.zoneCode.startsWith("G"));
  const facilities = zones.filter(
    (z) => z.zoneCode.startsWith("FC") || z.zoneCode.startsWith("MED")
  );

  return (
    <div className="glass-card p-5">
      <h3 className="mb-4 text-sm font-semibold text-text-primary">
        Stadium Heatmap
      </h3>

      {/* Stadium Layout Grid */}
      <div className="mx-auto max-w-sm" role="img" aria-label="Stadium zone density heatmap">
        {/* North Stands */}
        <div className="mb-2 flex justify-center gap-2">
          {stands
            .filter((z) => z.zoneCode.startsWith("NS"))
            .map((zone) => (
              <ZoneBlock key={zone.zoneId} zone={zone} />
            ))}
        </div>

        {/* West - Pitch - East */}
        <div className="mb-2 flex items-center justify-center gap-2">
          {stands
            .filter((z) => z.zoneCode === "WS")
            .map((zone) => (
              <ZoneBlock key={zone.zoneId} zone={zone} tall />
            ))}

          {/* Pitch */}
          <div className="flex h-24 w-28 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-500/5">
            <span className="text-xs font-bold text-emerald-500/60">⚽ PITCH</span>
          </div>

          {stands
            .filter((z) => z.zoneCode === "ES")
            .map((zone) => (
              <ZoneBlock key={zone.zoneId} zone={zone} tall />
            ))}
        </div>

        {/* South Stands */}
        <div className="mb-4 flex justify-center gap-2">
          {stands
            .filter((z) => z.zoneCode.startsWith("SS"))
            .map((zone) => (
              <ZoneBlock key={zone.zoneId} zone={zone} />
            ))}
          {stands
            .filter((z) => z.zoneCode === "VIP")
            .map((zone) => (
              <ZoneBlock key={zone.zoneId} zone={zone} />
            ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 pt-2">
        {["low", "medium", "high", "critical"].map((level) => (
          <div key={level} className="flex items-center gap-1.5">
            <div className={cn("h-2.5 w-2.5 rounded-sm", riskColors[level])} />
            <span className="text-[10px] capitalize text-text-muted">{level}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ZoneBlock({
  zone,
  tall = false,
}: {
  zone: CrowdMetric;
  tall?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center rounded-lg border border-white/[0.06] transition-all duration-300",
        tall ? "h-24 w-16" : "h-14 w-20",
        riskGlow[zone.riskLevel]
      )}
      style={{
        background: `rgba(${
          zone.riskLevel === "critical"
            ? "239,68,68"
            : zone.riskLevel === "high"
            ? "249,115,22"
            : zone.riskLevel === "medium"
            ? "234,179,8"
            : "34,197,94"
        }, ${Math.min(0.4, zone.densityPercent / 250)})`,
      }}
      title={`${zone.zoneName}: ${zone.densityPercent}% (${zone.riskLevel})`}
      role="status"
      aria-label={`${zone.zoneName} at ${zone.densityPercent}% capacity, risk level ${zone.riskLevel}`}
    >
      <span className="text-[10px] font-bold text-text-primary">{zone.zoneCode}</span>
      <span className="text-xs font-mono font-semibold text-text-primary">
        {zone.densityPercent}%
      </span>
    </div>
  );
}
