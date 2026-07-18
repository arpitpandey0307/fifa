"use client";

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import { motion } from "framer-motion";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  trend?: { value: string; direction: "up" | "down" | "stable" };
  color?: "blue" | "green" | "amber" | "red" | "purple" | "cyan";
  className?: string;
}

const colorMap = {
  blue: "from-blue-500/20 to-blue-600/5 border-blue-500/20",
  green: "from-emerald-500/20 to-emerald-600/5 border-emerald-500/20",
  amber: "from-amber-500/20 to-amber-600/5 border-amber-500/20",
  red: "from-red-500/20 to-red-600/5 border-red-500/20",
  purple: "from-purple-500/20 to-purple-600/5 border-purple-500/20",
  cyan: "from-cyan-500/20 to-cyan-600/5 border-cyan-500/20",
};

const iconColorMap = {
  blue: "text-blue-400",
  green: "text-emerald-400",
  amber: "text-amber-400",
  red: "text-red-400",
  purple: "text-purple-400",
  cyan: "text-cyan-400",
};

const trendColorMap = {
  up: "text-emerald-400",
  down: "text-red-400",
  stable: "text-text-muted",
};

const trendIcon = {
  up: "↑",
  down: "↓",
  stable: "→",
};

export function StatCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  color = "blue",
  className,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "glass-card flex flex-col gap-3 bg-gradient-to-br p-4",
        colorMap[color],
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-text-muted">
          {title}
        </span>
        <span className={cn("h-5 w-5", iconColorMap[color])} aria-hidden="true">
          {icon}
        </span>
      </div>

      <div className="flex items-end gap-2">
        <span className="text-2xl font-bold tracking-tight text-text-primary">
          {value}
        </span>
        {trend && (
          <span
            className={cn("mb-0.5 text-xs font-semibold", trendColorMap[trend.direction])}
            aria-label={`Trend: ${trend.direction} ${trend.value}`}
          >
            {trendIcon[trend.direction]} {trend.value}
          </span>
        )}
      </div>

      {subtitle && (
        <span className="text-xs text-text-muted">{subtitle}</span>
      )}
    </motion.div>
  );
}

/**
 * Loading skeleton for stat cards.
 */
export function StatCardSkeleton() {
  return (
    <div className="glass-card flex flex-col gap-3 p-4">
      <div className="flex items-center justify-between">
        <div className="skeleton h-3 w-20" />
        <div className="skeleton h-5 w-5 rounded" />
      </div>
      <div className="skeleton h-8 w-24" />
      <div className="skeleton h-3 w-32" />
    </div>
  );
}
