"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Camera,
  Eye,
  AlertTriangle,
  CheckCircle2,
  Brain,
} from "lucide-react";
import { usePolling } from "@/hooks/use-data";
import { cn, getRiskBgColor, formatRelativeTime } from "@/lib/utils";
import type { DashboardData } from "@/types";

interface CameraFeed {
  id: string;
  name: string;
  location: string;
  status: "normal" | "alert" | "offline";
  alertDescription?: string;
  densityPercent: number;
}

interface SecurityEvent {
  id: string;
  camera: string;
  severity: "info" | "warning" | "critical";
  description: string;
  aiAnalysis: string;
  timestamp: string;
  status: "active" | "acknowledged" | "resolved";
}

const CAMERAS: CameraFeed[] = [
  { id: "CAM-01", name: "Camera 01", location: "Gate A Entrance", status: "normal", densityPercent: 42 },
  { id: "CAM-05", name: "Camera 05", location: "North Stand A", status: "normal", densityPercent: 78 },
  { id: "CAM-12", name: "Camera 12", location: "Concourse B", status: "normal", densityPercent: 55 },
  { id: "CAM-18", name: "Camera 18", location: "Gate B Entrance", status: "alert", alertDescription: "Unusual gathering detected", densityPercent: 88 },
  { id: "CAM-22", name: "Camera 22", location: "South Stand A", status: "normal", densityPercent: 35 },
  { id: "CAM-31", name: "Camera 31", location: "Food Court North", status: "normal", densityPercent: 67 },
  { id: "CAM-38", name: "Camera 38", location: "VIP Entrance", status: "normal", densityPercent: 22 },
  { id: "CAM-45", name: "Camera 45", location: "Parking Lot A", status: "offline", densityPercent: 0 },
];

const EVENTS: SecurityEvent[] = [
  {
    id: "evt-1",
    camera: "CAM-18",
    severity: "warning",
    description: "Unusual gathering of ~40 people detected near Gate B entrance",
    aiAnalysis: "Pattern consistent with entry bottleneck, not security threat. ~40 people clustered due to delayed ticket scanning. Recommend deploying 1 additional gate operator.",
    timestamp: new Date(Date.now() - 2 * 60000).toISOString(),
    status: "active",
  },
  {
    id: "evt-2",
    camera: "CAM-22",
    severity: "info",
    description: "Unattended bag detected near South Stand entrance",
    aiAnalysis: "Object appeared 3 min ago. 85% likely personal item based on context. Owner visible nearby in frame at position (342, 218). Monitor for 3 more minutes before escalating.",
    timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
    status: "acknowledged",
  },
  {
    id: "evt-3",
    camera: "CAM-07",
    severity: "info",
    description: "Zone clear after crowd dispersal at East Concourse",
    aiAnalysis: "Previous gathering resolved naturally as fans entered stands. Normal flow patterns restored. No further action needed.",
    timestamp: new Date(Date.now() - 18 * 60000).toISOString(),
    status: "resolved",
  },
  {
    id: "evt-4",
    camera: "CAM-31",
    severity: "warning",
    description: "Queue overflow at Food Court North extending into walkway",
    aiAnalysis: "Halftime rush causing food court congestion. Queue extending 15m into main concourse, reducing walkway width by ~40%. Recommend opening overflow service counter and deploying 2 volunteers for queue management.",
    timestamp: new Date(Date.now() - 8 * 60000).toISOString(),
    status: "active",
  },
];

const SEVERITY_COLORS = {
  info: "text-blue-400",
  warning: "text-amber-400",
  critical: "text-red-400",
};

const SEVERITY_BG = {
  info: "bg-blue-500/10 border-blue-500/20",
  warning: "bg-amber-500/10 border-amber-500/20",
  critical: "bg-red-500/10 border-red-500/20",
};

const STATUS_ICONS = {
  active: "🔴",
  acknowledged: "🟡",
  resolved: "🟢",
};

export default function SecurityPage() {
  const { data } = usePolling<DashboardData>(
    useCallback(async () => {
      const res = await fetch("/api/data/dashboard");
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    }, []),
    30000
  );

  const [selectedCamera, setSelectedCamera] = useState<string | null>(null);
  const [eventFilter, setEventFilter] = useState<"all" | "active" | "resolved">("all");

  const camerasOnline = CAMERAS.filter((c) => c.status !== "offline").length;
  const activeAlerts = CAMERAS.filter((c) => c.status === "alert").length;
  const filteredEvents = EVENTS.filter((e) =>
    eventFilter === "all" ? true : eventFilter === "active" ? e.status !== "resolved" : e.status === "resolved"
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="gradient-blue flex h-10 w-10 items-center justify-center rounded-xl">
            <Shield className="h-5 w-5 text-white" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-text-primary">
              Security Copilot
            </h1>
            <p className="text-sm text-text-secondary">
              AI-augmented surveillance with anomaly detection and threat assessment
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1.5">
            <Camera className="h-3.5 w-3.5 text-emerald-400" />
            <span className="text-xs font-semibold text-emerald-400">
              {camerasOnline}/{CAMERAS.length} Online
            </span>
          </div>
          {activeAlerts > 0 && (
            <div className="flex items-center gap-2 rounded-full bg-amber-500/10 px-3 py-1.5">
              <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
              <span className="text-xs font-semibold text-amber-400">
                {activeAlerts} Alert{activeAlerts > 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>
      </motion.div>

      {/* AI Threat Assessment */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="glass-card overflow-hidden"
      >
        <div className="flex items-center gap-3 border-b border-white/[0.06] px-5 py-3">
          <Brain className="h-4 w-4 text-accent-blue" aria-hidden="true" />
          <span className="text-sm font-semibold text-text-primary">
            AI Threat Assessment
          </span>
          <span className={cn(
            "ml-auto rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase",
            getRiskBgColor("medium")
          )}>
            LOW-MEDIUM
          </span>
        </div>
        <div className="p-5">
          <p className="text-sm leading-relaxed text-text-secondary">
            <strong className="text-text-primary">{activeAlerts} active alert{activeAlerts !== 1 ? "s" : ""}</strong> detected across {camerasOnline} cameras.
            Camera 18 flagged unusual gathering at Gate B — analysis indicates entry processing delay, not a security threat.
            All other zones within normal behavioral patterns.
            {" "}<strong className="text-accent-blue">Recommend deploying 1 additional gate operator to Gate B</strong> to alleviate the bottleneck.
          </p>
        </div>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Camera Feed Grid */}
        <div className="lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-text-primary">Camera Feeds</h2>
            <div className="flex items-center gap-1.5 text-[10px] text-text-muted">
              <Eye className="h-3 w-3" /> AI monitoring active
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {CAMERAS.map((cam, i) => (
              <motion.button
                key={cam.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => setSelectedCamera(selectedCamera === cam.id ? null : cam.id)}
                className={cn(
                  "glass-card p-3 text-left transition-all",
                  selectedCamera === cam.id && "ring-1 ring-accent-blue/40",
                  cam.status === "alert" && "border-amber-500/30",
                  cam.status === "offline" && "opacity-50"
                )}
              >
                {/* Camera placeholder visual */}
                <div className={cn(
                  "mb-2 flex h-20 items-center justify-center rounded-lg",
                  cam.status === "alert"
                    ? "bg-amber-500/10"
                    : cam.status === "offline"
                    ? "bg-white/[0.03]"
                    : "bg-white/[0.04]"
                )}>
                  <Camera className={cn(
                    "h-6 w-6",
                    cam.status === "alert" ? "text-amber-400" : cam.status === "offline" ? "text-text-muted/30" : "text-text-muted/50"
                  )} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-text-primary">{cam.id}</span>
                  <span className={cn(
                    "text-[9px] font-bold uppercase",
                    cam.status === "alert" ? "text-amber-400" : cam.status === "offline" ? "text-text-muted" : "text-emerald-400"
                  )}>
                    {cam.status === "alert" ? "⚠️ ALERT" : cam.status === "offline" ? "○ OFFLINE" : "● OK"}
                  </span>
                </div>
                <p className="text-[10px] text-text-muted">{cam.location}</p>
                {cam.status !== "offline" && (
                  <div className="mt-1.5">
                    <div className="mb-0.5 flex justify-between text-[9px]">
                      <span className="text-text-muted">Density</span>
                      <span className="font-mono text-text-secondary">{cam.densityPercent}%</span>
                    </div>
                    <div className="h-1 overflow-hidden rounded-full bg-white/[0.06]">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all",
                          cam.densityPercent > 80 ? "bg-red-500" : cam.densityPercent > 60 ? "bg-amber-500" : "bg-emerald-500"
                        )}
                        style={{ width: `${cam.densityPercent}%` }}
                      />
                    </div>
                  </div>
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Event Timeline */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-text-primary">Event Timeline</h2>
            <div className="flex gap-1">
              {(["all", "active", "resolved"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setEventFilter(f)}
                  className={cn(
                    "rounded-md px-2 py-1 text-[10px] font-medium transition-colors",
                    eventFilter === f ? "bg-accent-blue/15 text-accent-blue" : "text-text-muted hover:text-text-secondary"
                  )}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <AnimatePresence>
              {filteredEvents.map((event, i) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ delay: i * 0.05 }}
                  className={cn(
                    "glass-card overflow-hidden border",
                    SEVERITY_BG[event.severity]
                  )}
                >
                  <div className="p-4">
                    <div className="mb-1.5 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs">{STATUS_ICONS[event.status]}</span>
                        <span className={cn("text-[10px] font-bold uppercase", SEVERITY_COLORS[event.severity])}>
                          {event.camera}
                        </span>
                      </div>
                      <span className="text-[10px] text-text-muted">
                        {formatRelativeTime(event.timestamp)}
                      </span>
                    </div>

                    <p className="mb-2 text-xs text-text-primary">{event.description}</p>

                    <div className="rounded-lg bg-white/[0.03] p-2.5">
                      <p className="mb-1 text-[9px] font-bold uppercase tracking-wider text-accent-blue">
                        AI Analysis
                      </p>
                      <p className="text-[11px] leading-relaxed text-text-secondary">
                        {event.aiAnalysis}
                      </p>
                    </div>

                    {event.status === "active" && (
                      <div className="mt-2.5 flex gap-1.5">
                        <button className="rounded-md bg-accent-blue/15 px-2.5 py-1 text-[10px] font-semibold text-accent-blue transition-colors hover:bg-accent-blue/25">
                          Acknowledge
                        </button>
                        <button className="rounded-md bg-amber-500/15 px-2.5 py-1 text-[10px] font-semibold text-amber-400 transition-colors hover:bg-amber-500/25">
                          Dispatch
                        </button>
                        <button className="rounded-md bg-red-500/15 px-2.5 py-1 text-[10px] font-semibold text-red-400 transition-colors hover:bg-red-500/25">
                          Escalate
                        </button>
                      </div>
                    )}

                    {event.status === "acknowledged" && (
                      <p className="mt-2 flex items-center gap-1.5 text-[10px] text-text-muted">
                        <CheckCircle2 className="h-3 w-3 text-amber-400" />
                        Acknowledged by Officer Chen
                      </p>
                    )}

                    {event.status === "resolved" && (
                      <p className="mt-2 flex items-center gap-1.5 text-[10px] text-text-muted">
                        <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                        Resolved
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
