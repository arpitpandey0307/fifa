"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  Send,
  Shield,
  MapPin,
  Clock,
  Route,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { cn, getRiskBgColor, getRiskColor } from "@/lib/utils";
import type { IncidentTriageResult } from "@/types";

export default function IncidentsPage() {
  const [description, setDescription] = useState("");
  const [isTriaging, setIsTriaging] = useState(false);
  const [triage, setTriage] = useState<IncidentTriageResult | null>(null);
  const [history, setHistory] = useState<
    Array<{ description: string; triage: IncidentTriageResult; timestamp: string }>
  >([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || isTriaging) return;

    setIsTriaging(true);
    setTriage(null);

    try {
      const res = await fetch("/api/ai/incident", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description }),
      });

      if (res.ok) {
        const data = await res.json();
        setTriage(data.triage);
        setHistory((prev) => [
          { description, triage: data.triage, timestamp: new Date().toISOString() },
          ...prev,
        ]);
      }
    } catch (err) {
      console.error("Triage error:", err);
    } finally {
      setIsTriaging(false);
    }
  };

  const exampleReports = [
    "Someone fainted near Gate B entrance, they appear unconscious",
    "Large crowd pushing against barriers at South Stand entrance",
    "Suspicious unattended backpack left near North Food Court",
    "Fan with chest pain in section NS-A row 15",
    "Small fire spotted near a food vendor in FC-S",
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold tracking-tight text-text-primary">
          Incident Commander
        </h1>
        <p className="text-sm text-text-secondary">
          AI-powered incident triage and dispatch — describe what happened in natural language
        </p>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left: Report Form */}
        <div className="space-y-4">
          <form onSubmit={handleSubmit} className="glass-card p-5">
            <label
              htmlFor="incident-report"
              className="mb-2 block text-sm font-semibold text-text-primary"
            >
              Report an Incident
            </label>
            <p className="mb-3 text-xs text-text-muted">
              Describe the incident in your own words. The AI will extract location, type, severity,
              and recommend dispatch actions.
            </p>
            <textarea
              id="incident-report"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="E.g., Someone fainted near Gate B, they look unconscious..."
              className="glass-input mb-3 h-28 w-full resize-none px-4 py-3 text-sm placeholder:text-text-muted"
              maxLength={1000}
              aria-describedby="char-count"
            />
            <div className="flex items-center justify-between">
              <span id="char-count" className="text-[10px] text-text-muted">
                {description.length}/1000
              </span>
              <button
                type="submit"
                disabled={!description.trim() || isTriaging}
                className="gradient-danger flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-40"
              >
                {isTriaging ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <AlertTriangle className="h-4 w-4" />
                )}
                {isTriaging ? "AI Triaging..." : "Triage with AI"}
              </button>
            </div>
          </form>

          {/* Example Reports */}
          <div className="glass-card p-4">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-text-muted">
              Quick Report Examples
            </p>
            <div className="space-y-1.5">
              {exampleReports.map((report) => (
                <button
                  key={report}
                  onClick={() => setDescription(report)}
                  className="w-full rounded-lg px-3 py-2 text-left text-xs text-text-secondary transition-colors hover:bg-white/[0.04]"
                >
                  {report}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Triage Result */}
        <div>
          <AnimatePresence mode="wait">
            {isTriaging && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass-card flex flex-col items-center justify-center p-12"
              >
                <Loader2 className="mb-4 h-10 w-10 animate-spin text-accent-blue" />
                <p className="text-sm font-semibold text-text-primary">
                  AI Analyzing Incident...
                </p>
                <p className="text-xs text-text-muted">
                  Extracting location, classifying severity, finding nearest responder
                </p>
              </motion.div>
            )}

            {!isTriaging && triage && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card overflow-hidden"
              >
                {/* Triage Header */}
                <div
                  className={cn(
                    "flex items-center justify-between border-b border-white/[0.06] px-5 py-3",
                    triage.severity === "critical" && "bg-red-500/10",
                    triage.severity === "high" && "bg-orange-500/10"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-text-primary" aria-hidden="true" />
                    <span className="text-sm font-bold uppercase text-text-primary">
                      {triage.incidentType} Incident
                    </span>
                  </div>
                  <span
                    className={cn(
                      "rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase",
                      getRiskBgColor(triage.severity)
                    )}
                  >
                    {triage.severity}
                  </span>
                </div>

                <div className="space-y-4 p-5">
                  {/* Location */}
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent-blue" aria-hidden="true" />
                    <div>
                      <p className="text-xs font-semibold text-text-primary">
                        {triage.extractedLocation}
                      </p>
                      <p className="text-[10px] text-text-muted">
                        Zone: {triage.zoneId} • Crowd density: {triage.crowdLevelAtLocation}%
                      </p>
                    </div>
                  </div>

                  {/* Nearest Responder */}
                  <div className="flex items-start gap-3">
                    <Clock className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" aria-hidden="true" />
                    <div>
                      <p className="text-xs font-semibold text-text-primary">
                        {triage.nearestResponder.teamId} — {triage.nearestResponder.currentLocation}
                      </p>
                      <p className="text-[10px] text-text-muted">
                        ETA: {triage.nearestResponder.estimatedArrivalMinutes} minutes
                      </p>
                    </div>
                  </div>

                  {/* Route */}
                  <div className="flex items-start gap-3">
                    <Route className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" aria-hidden="true" />
                    <div>
                      <p className="text-xs font-semibold text-text-primary">
                        Fastest Route
                      </p>
                      <p className="text-[10px] text-text-muted">
                        {triage.fastestRoute.join(" → ")}
                      </p>
                    </div>
                  </div>

                  {/* Dispatch Recommendation */}
                  <div className="rounded-lg bg-accent-blue/10 p-3">
                    <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-accent-blue">
                      AI Dispatch Recommendation
                    </p>
                    <p className="text-xs leading-relaxed text-text-secondary">
                      {triage.dispatchRecommendation}
                    </p>
                  </div>

                  {/* Additional Actions */}
                  {triage.additionalActions.length > 0 && (
                    <div>
                      <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-text-muted">
                        Additional Actions
                      </p>
                      <ul className="space-y-1" role="list">
                        {triage.additionalActions.map((action, i) => (
                          <li key={i} className="flex items-center gap-2 text-xs text-text-secondary">
                            <CheckCircle2 className="h-3 w-3 text-emerald-400" aria-hidden="true" />
                            {action}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {!isTriaging && !triage && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-card flex flex-col items-center justify-center p-12 text-center"
              >
                <AlertTriangle className="mb-3 h-10 w-10 text-text-muted/30" />
                <p className="text-sm text-text-muted">
                  Submit an incident report to see AI-powered triage results
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
