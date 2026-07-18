"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Clock,
  MapPin,
  CheckCircle2,
  Brain,
  Star,
  Navigation,
  Zap,
  Coffee,
} from "lucide-react";
import { cn, getRiskBgColor, getRiskColor } from "@/lib/utils";

type TaskPriority = "urgent" | "high" | "medium" | "low";
type TaskStatus = "pending" | "in_progress" | "completed";

interface VolunteerTask {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  location: string;
  zone: string;
  estimatedMinutes: number;
  distanceMeters: number;
  assignedAt: string;
  skill: string;
}

const TASKS: VolunteerTask[] = [
  {
    id: "task-1",
    title: "Wheelchair Assistance",
    description: "Fan requires wheelchair assistance from Gate B to Section NS-A, Row 5",
    priority: "urgent",
    status: "pending",
    location: "Gate B Entrance",
    zone: "GB",
    estimatedMinutes: 15,
    distanceMeters: 120,
    assignedAt: new Date(Date.now() - 3 * 60000).toISOString(),
    skill: "Accessibility Support",
  },
  {
    id: "task-2",
    title: "Restock Water Station",
    description: "Water station at Zone C concourse running low, needs 2 cases of bottled water",
    priority: "high",
    status: "pending",
    location: "Concourse C Water Station",
    zone: "CC",
    estimatedMinutes: 20,
    distanceMeters: 200,
    assignedAt: new Date(Date.now() - 8 * 60000).toISOString(),
    skill: "Supply Management",
  },
  {
    id: "task-3",
    title: "Guide Group to Section",
    description: "Group of 12 Spanish-speaking fans need navigation to VIP section from Gate D",
    priority: "medium",
    status: "pending",
    location: "Gate D Lobby",
    zone: "GD",
    estimatedMinutes: 10,
    distanceMeters: 80,
    assignedAt: new Date(Date.now() - 12 * 60000).toISOString(),
    skill: "Fan Guidance",
  },
  {
    id: "task-4",
    title: "Queue Management - Food Court",
    description: "Manage overflow queue at North Food Court during halftime rush",
    priority: "high",
    status: "in_progress",
    location: "Food Court North",
    zone: "FC-N",
    estimatedMinutes: 25,
    distanceMeters: 150,
    assignedAt: new Date(Date.now() - 15 * 60000).toISOString(),
    skill: "Crowd Management",
  },
  {
    id: "task-5",
    title: "Lost Child Reunification",
    description: "Child (age ~7, blue shirt) reported lost near South Stand. Parents at Medical Station 1",
    priority: "urgent",
    status: "in_progress",
    location: "South Stand Concourse",
    zone: "SS-A",
    estimatedMinutes: 15,
    distanceMeters: 180,
    assignedAt: new Date(Date.now() - 5 * 60000).toISOString(),
    skill: "Fan Assistance",
  },
  {
    id: "task-6",
    title: "Signage Repair",
    description: "Directional sign at East Concourse junction has fallen, creating navigation confusion",
    priority: "low",
    status: "pending",
    location: "East Concourse Junction",
    zone: "ES",
    estimatedMinutes: 10,
    distanceMeters: 250,
    assignedAt: new Date(Date.now() - 20 * 60000).toISOString(),
    skill: "Maintenance",
  },
];

const PRIORITY_COLORS: Record<TaskPriority, string> = {
  urgent: "text-red-400",
  high: "text-amber-400",
  medium: "text-blue-400",
  low: "text-text-muted",
};

const PRIORITY_BG: Record<TaskPriority, string> = {
  urgent: "bg-red-500/15 border-red-500/30",
  high: "bg-amber-500/15 border-amber-500/30",
  medium: "bg-blue-500/15 border-blue-500/30",
  low: "bg-white/[0.04] border-white/[0.08]",
};

const PRIORITY_ICONS: Record<TaskPriority, string> = {
  urgent: "🔴",
  high: "🟡",
  medium: "🔵",
  low: "⚪",
};

const SHIFT_MILESTONES = [
  { time: "14:00", label: "Started", completed: true },
  { time: "16:00", label: "Break 1", completed: true },
  { time: "18:00", label: "Now", completed: true, isCurrent: true },
  { time: "20:00", label: "Break 2", completed: false },
  { time: "22:00", label: "End", completed: false },
];

export default function VolunteerPage() {
  const [tasks, setTasks] = useState(TASKS);
  const [filter, setFilter] = useState<"all" | "pending" | "in_progress" | "completed">("all");

  const pendingCount = tasks.filter((t) => t.status === "pending").length;
  const inProgressCount = tasks.filter((t) => t.status === "in_progress").length;
  const completedCount = tasks.filter((t) => t.status === "completed").length;

  const filteredTasks = tasks
    .filter((t) => filter === "all" ? true : t.status === filter)
    .sort((a, b) => {
      const priorityOrder: Record<TaskPriority, number> = { urgent: 0, high: 1, medium: 2, low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

  const startTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: "in_progress" as const } : t))
    );
  };

  const completeTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: "completed" as const } : t))
    );
  };

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
            <Users className="h-5 w-5 text-white" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-text-primary">
              Volunteer Copilot
            </h1>
            <p className="text-sm text-text-secondary">
              AI-powered task management and dynamic assignment
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-full bg-accent-blue/10 px-3 py-1.5">
            <Star className="h-3.5 w-3.5 text-accent-blue" />
            <span className="text-xs font-semibold text-accent-blue">Priya — 6h shift</span>
          </div>
        </div>
      </motion.div>

      {/* AI Copilot Message */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="glass-card overflow-hidden"
      >
        <div className="flex items-center gap-3 border-b border-white/[0.06] px-5 py-3">
          <Brain className="h-4 w-4 text-accent-blue" aria-hidden="true" />
          <span className="text-sm font-semibold text-text-primary">AI Copilot Says</span>
        </div>
        <div className="p-5">
          <p className="text-sm leading-relaxed text-text-secondary">
            You have <strong className="text-text-primary">{pendingCount} pending</strong> and{" "}
            <strong className="text-text-primary">{inProgressCount} in-progress</strong> tasks.{" "}
            {tasks.find((t) => t.priority === "urgent" && t.status === "pending") ? (
              <>
                Start with <strong className="text-red-400">Task #1 (URGENT)</strong> — a fan needs
                wheelchair assistance at Gate B. Fastest route via{" "}
                <strong className="text-accent-blue">Corridor D</strong> (2 min walk).
              </>
            ) : (
              <>
                Great work! No urgent tasks pending. Focus on{" "}
                <strong className="text-amber-400">high priority</strong> items next.
              </>
            )}
          </p>
        </div>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Task List */}
        <div className="lg:col-span-2 space-y-4">
          {/* Filter Tabs */}
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-text-primary">Active Tasks</h2>
            <div className="flex gap-1">
              {([
                { key: "all", label: "All", count: tasks.length },
                { key: "pending", label: "Pending", count: pendingCount },
                { key: "in_progress", label: "Active", count: inProgressCount },
                { key: "completed", label: "Done", count: completedCount },
              ] as const).map((f) => (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={cn(
                    "rounded-md px-2.5 py-1 text-[10px] font-medium transition-colors",
                    filter === f.key
                      ? "bg-accent-blue/15 text-accent-blue"
                      : "text-text-muted hover:text-text-secondary"
                  )}
                >
                  {f.label} ({f.count})
                </button>
              ))}
            </div>
          </div>

          {/* Task Cards */}
          <div className="space-y-3">
            <AnimatePresence>
              {filteredTasks.map((task, i) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ delay: i * 0.04 }}
                  className={cn(
                    "glass-card overflow-hidden border",
                    PRIORITY_BG[task.priority],
                    task.status === "completed" && "opacity-60"
                  )}
                >
                  <div className="p-4">
                    {/* Task Header */}
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs">{PRIORITY_ICONS[task.priority]}</span>
                        <span className={cn("text-[10px] font-bold uppercase", PRIORITY_COLORS[task.priority])}>
                          {task.priority}
                        </span>
                        <span className="text-[10px] text-text-muted">•</span>
                        <span className="text-[10px] text-text-muted">{task.skill}</span>
                      </div>
                      <span className={cn(
                        "rounded-full px-2 py-0.5 text-[9px] font-bold uppercase",
                        task.status === "completed"
                          ? "bg-emerald-500/15 text-emerald-400"
                          : task.status === "in_progress"
                          ? "bg-accent-blue/15 text-accent-blue"
                          : "bg-white/[0.04] text-text-muted"
                      )}>
                        {task.status === "in_progress" ? "In Progress" : task.status}
                      </span>
                    </div>

                    {/* Title & Description */}
                    <h3 className="mb-1 text-sm font-semibold text-text-primary">{task.title}</h3>
                    <p className="mb-3 text-xs text-text-secondary">{task.description}</p>

                    {/* Meta Row */}
                    <div className="mb-3 flex flex-wrap gap-3">
                      <div className="flex items-center gap-1.5 text-[11px] text-text-muted">
                        <MapPin className="h-3 w-3" />
                        {task.location}
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-text-muted">
                        <Clock className="h-3 w-3" />
                        Est. {task.estimatedMinutes} min
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-text-muted">
                        <Navigation className="h-3 w-3" />
                        {task.distanceMeters}m away
                      </div>
                    </div>

                    {/* Actions */}
                    {task.status !== "completed" && (
                      <div className="flex gap-2">
                        {task.status === "pending" && (
                          <button
                            onClick={() => startTask(task.id)}
                            className="gradient-blue flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-semibold text-white transition-all hover:opacity-90"
                          >
                            <Zap className="h-3 w-3" /> Start Task
                          </button>
                        )}
                        {task.status === "in_progress" && (
                          <button
                            onClick={() => completeTask(task.id)}
                            className="gradient-success flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-semibold text-white transition-all hover:opacity-90"
                          >
                            <CheckCircle2 className="h-3 w-3" /> Complete
                          </button>
                        )}
                        <button className="flex items-center gap-1.5 rounded-lg bg-white/[0.04] px-3 py-1.5 text-[11px] font-medium text-text-secondary transition-colors hover:bg-white/[0.08]">
                          <Navigation className="h-3 w-3" /> Navigate
                        </button>
                      </div>
                    )}

                    {task.status === "completed" && (
                      <p className="flex items-center gap-1.5 text-[11px] text-emerald-400">
                        <CheckCircle2 className="h-3 w-3" /> Completed
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-4">
          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-4"
          >
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-muted">
              Shift Summary
            </h3>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <p className="text-2xl font-bold text-text-primary">{completedCount}</p>
                <p className="text-[10px] text-text-muted">Completed</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-accent-blue">{inProgressCount}</p>
                <p className="text-[10px] text-text-muted">Active</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-400">{pendingCount}</p>
                <p className="text-[10px] text-text-muted">Pending</p>
              </div>
            </div>
          </motion.div>

          {/* Shift Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="glass-card p-4"
          >
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-text-muted">
              Shift Timeline
            </h3>
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-[7px] top-2 h-[calc(100%-16px)] w-[2px] bg-white/[0.08]" />
              <div className="space-y-4">
                {SHIFT_MILESTONES.map((ms) => (
                  <div key={ms.time} className="flex items-center gap-3">
                    <div className={cn(
                      "relative z-10 h-4 w-4 rounded-full border-2",
                      ms.isCurrent
                        ? "border-accent-blue bg-accent-blue animate-pulse-glow"
                        : ms.completed
                        ? "border-emerald-500 bg-emerald-500"
                        : "border-white/20 bg-bg-primary"
                    )} />
                    <div className="flex flex-1 items-center justify-between">
                      <span className={cn(
                        "text-xs font-medium",
                        ms.isCurrent ? "text-accent-blue" : ms.completed ? "text-text-primary" : "text-text-muted"
                      )}>
                        {ms.label}
                      </span>
                      <span className="text-[10px] font-mono text-text-muted">{ms.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Break reminder */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-4"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/15">
                <Coffee className="h-4 w-4 text-amber-400" />
              </div>
              <div>
                <p className="text-xs font-semibold text-text-primary">Next Break</p>
                <p className="text-[10px] text-text-muted">Scheduled at 20:00 — 2h from now</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
