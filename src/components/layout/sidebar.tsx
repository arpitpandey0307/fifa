"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  MessageSquare,
  Users,
  AlertTriangle,
  Leaf,
  Bus,
  Settings,
  ChevronLeft,
  Zap,
  Shield,
  HandHelping,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/lib/constants";
import { useState } from "react";

const ICON_MAP: Record<string, React.ElementType> = {
  LayoutDashboard,
  MessageSquare,
  Users,
  AlertTriangle,
  Leaf,
  Bus,
  Settings,
  Shield,
  HandHelping,
};

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      className="glass-panel fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-white/[0.06] py-4"
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 pb-6">
        <div className="gradient-blue flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
          <Zap className="h-5 w-5 text-white" aria-hidden="true" />
        </div>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <h1 className="text-sm font-bold tracking-tight text-white">
              FIFA Nexus AI
            </h1>
            <p className="text-[10px] font-medium text-text-secondary">
              Smart Stadium OS
            </p>
          </motion.div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3" aria-label="Dashboard pages">
        {NAV_ITEMS.map((item) => {
          const Icon = ICON_MAP[item.icon] || LayoutDashboard;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-accent-blue/15 text-accent-blue"
                  : "text-text-secondary hover:bg-white/[0.04] hover:text-text-primary"
              )}
              aria-current={isActive ? "page" : undefined}
              title={collapsed ? item.label : undefined}
            >
              {isActive && (
                <motion.div
                  layoutId="active-nav"
                  className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-full bg-accent-blue"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
              <Icon
                className={cn(
                  "h-[18px] w-[18px] shrink-0",
                  isActive ? "text-accent-blue" : "text-text-muted group-hover:text-text-secondary"
                )}
                aria-hidden="true"
              />
              {!collapsed && (
                <span className="truncate">{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Collapse Toggle */}
      <div className="px-3 pt-2">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex w-full items-center justify-center rounded-lg p-2 text-text-muted transition-colors hover:bg-white/[0.04] hover:text-text-secondary"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <ChevronLeft
            className={cn(
              "h-4 w-4 transition-transform duration-200",
              collapsed && "rotate-180"
            )}
          />
        </button>
      </div>
    </motion.aside>
  );
}
