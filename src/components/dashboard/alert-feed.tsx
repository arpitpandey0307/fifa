"use client";

import { motion } from "framer-motion";
import { cn, formatTime, getSeverityIcon } from "@/lib/utils";
import type { Alert } from "@/types";
import { Bell } from "lucide-react";

interface AlertFeedProps {
  alerts: Alert[];
  maxItems?: number;
}

const severityBorder = {
  info: "border-l-blue-400",
  warning: "border-l-amber-400",
  critical: "border-l-red-400",
  emergency: "border-l-red-500",
};

export function AlertFeed({ alerts, maxItems = 5 }: AlertFeedProps) {
  const displayAlerts = alerts.slice(0, maxItems);

  return (
    <div className="glass-card overflow-hidden">
      <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-3">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-amber-400" aria-hidden="true" />
          <h3 className="text-sm font-semibold text-text-primary">Live Alerts</h3>
        </div>
        <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold text-amber-400">
          {alerts.filter((a) => !a.acknowledged).length} active
        </span>
      </div>

      <div className="divide-y divide-white/[0.04]" role="log" aria-label="Live alerts">
        {displayAlerts.length === 0 ? (
          <div className="px-5 py-8 text-center text-sm text-text-muted">
            No active alerts
          </div>
        ) : (
          displayAlerts.map((alert, i) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05, duration: 0.25 }}
              className={cn(
                "border-l-2 px-5 py-3 transition-colors hover:bg-white/[0.02]",
                severityBorder[alert.severity],
                alert.acknowledged && "opacity-60"
              )}
              role="alert"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span aria-hidden="true">{getSeverityIcon(alert.severity)}</span>
                    <span className="text-xs font-semibold text-text-primary">
                      {alert.title}
                    </span>
                    {alert.zone && (
                      <span className="rounded bg-white/[0.06] px-1.5 py-0.5 text-[10px] font-mono text-text-muted">
                        {alert.zone}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-text-secondary">{alert.message}</p>
                  {alert.aiRecommendation && (
                    <p className="mt-1.5 text-[11px] italic text-accent-blue">
                      💡 {alert.aiRecommendation}
                    </p>
                  )}
                </div>
                <span className="shrink-0 text-[10px] font-mono text-text-muted">
                  {formatTime(alert.timestamp)}
                </span>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
