"use client";

import { motion } from "framer-motion";
import { Settings as SettingsIcon, Globe, Accessibility, Eye, Vibrate, Bell, User } from "lucide-react";
import { useSettingsStore } from "@/stores/settings-store";
import { SUPPORTED_LANGUAGES } from "@/lib/constants";
import { cn } from "@/lib/utils";

const ROLES = [
  { value: "manager", label: "Stadium Manager", icon: "🏟️" },
  { value: "fan", label: "Fan", icon: "🎉" },
  { value: "volunteer", label: "Volunteer", icon: "🙋" },
  { value: "security", label: "Security", icon: "🛡️" },
  { value: "medical", label: "Medical", icon: "🏥" },
  { value: "transport", label: "Transport", icon: "🚌" },
  { value: "vendor", label: "Vendor", icon: "🍔" },
] as const;

export default function SettingsPage() {
  const store = useSettingsStore();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold tracking-tight text-text-primary">
          Settings
        </h1>
        <p className="text-sm text-text-secondary">
          Customize your experience and accessibility preferences
        </p>
      </motion.div>

      {/* Role Selection */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="glass-card p-5"
      >
        <div className="mb-4 flex items-center gap-2">
          <User className="h-4 w-4 text-accent-blue" aria-hidden="true" />
          <h2 className="text-sm font-semibold text-text-primary">Role</h2>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {ROLES.map((role) => (
            <button
              key={role.value}
              onClick={() => store.setRole(role.value)}
              className={cn(
                "rounded-lg border px-3 py-2.5 text-xs font-medium transition-all",
                store.role === role.value
                  ? "border-accent-blue/40 bg-accent-blue/15 text-accent-blue"
                  : "border-white/[0.06] text-text-secondary hover:border-white/[0.12] hover:text-text-primary"
              )}
              aria-pressed={store.role === role.value}
            >
              <span className="mb-1 block text-lg">{role.icon}</span>
              {role.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Language */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-5"
      >
        <div className="mb-4 flex items-center gap-2">
          <Globe className="h-4 w-4 text-accent-cyan" aria-hidden="true" />
          <h2 className="text-sm font-semibold text-text-primary">Language</h2>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {SUPPORTED_LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => store.setLanguage(lang.code)}
              className={cn(
                "rounded-lg border px-3 py-2.5 text-xs font-medium transition-all",
                store.language === lang.code
                  ? "border-accent-cyan/40 bg-accent-cyan/15 text-accent-cyan"
                  : "border-white/[0.06] text-text-secondary hover:border-white/[0.12] hover:text-text-primary"
              )}
              aria-pressed={store.language === lang.code}
            >
              <span className="block font-semibold">{lang.nativeName}</span>
              <span className="text-[10px] opacity-60">{lang.name}</span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Accessibility */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="glass-card p-5"
      >
        <div className="mb-4 flex items-center gap-2">
          <Accessibility className="h-4 w-4 text-emerald-400" aria-hidden="true" />
          <h2 className="text-sm font-semibold text-text-primary">Accessibility</h2>
        </div>
        <div className="space-y-3">
          <ToggleRow
            icon={<Accessibility className="h-4 w-4" />}
            label="Accessibility Mode"
            description="Enable screen reader optimizations and larger touch targets"
            checked={store.accessibilityMode}
            onChange={store.toggleAccessibility}
          />
          <ToggleRow
            icon={<Eye className="h-4 w-4" />}
            label="High Contrast"
            description="Increase contrast for better visibility"
            checked={store.highContrast}
            onChange={store.toggleHighContrast}
          />
          <ToggleRow
            icon={<Vibrate className="h-4 w-4" />}
            label="Reduced Motion"
            description="Minimize animations for vestibular sensitivity"
            checked={store.reducedMotion}
            onChange={store.toggleReducedMotion}
          />
          <ToggleRow
            icon={<Bell className="h-4 w-4" />}
            label="Notifications"
            description="Receive real-time alerts and updates"
            checked={store.notifications}
            onChange={store.toggleNotifications}
          />
        </div>
      </motion.div>
    </div>
  );
}

function ToggleRow({
  icon,
  label,
  description,
  checked,
  onChange,
}: {
  icon: React.ReactNode;
  label: string;
  description: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-white/[0.06] px-4 py-3">
      <div className="flex items-center gap-3">
        <span className="text-text-muted" aria-hidden="true">{icon}</span>
        <div>
          <p className="text-xs font-semibold text-text-primary">{label}</p>
          <p className="text-[10px] text-text-muted">{description}</p>
        </div>
      </div>
      <button
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        className={cn(
          "relative h-6 w-11 rounded-full transition-colors",
          checked ? "bg-accent-blue" : "bg-white/10"
        )}
        aria-label={`Toggle ${label}`}
      >
        <span
          className={cn(
            "absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform",
            checked && "translate-x-5"
          )}
        />
      </button>
    </div>
  );
}
