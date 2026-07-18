import Link from "next/link";
import { Zap, ArrowRight, Shield, Brain, Users, Leaf, Bus, MessageSquare } from "lucide-react";

export default function HomePage() {
  return (
    <div className="gradient-mesh flex min-h-screen flex-col items-center justify-center px-4">
      {/* Hero */}
      <div className="animate-fade-in text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-2xl shadow-blue-500/20">
          <Zap className="h-10 w-10 text-white" />
        </div>
        <h1 className="mb-2 text-4xl font-black tracking-tight text-white sm:text-5xl">
          FIFA Nexus AI
        </h1>
        <p className="mx-auto mb-8 max-w-lg text-lg text-text-secondary">
          The AI Operating System for FIFA World Cup 2026 Smart Stadiums.
          Real-time intelligence powered by Gemini AI.
        </p>
        <Link
          href="/command-center"
          className="gradient-blue inline-flex items-center gap-2 rounded-2xl px-8 py-4 text-base font-bold text-white shadow-xl shadow-blue-500/20 transition-all hover:shadow-2xl hover:shadow-blue-500/30"
        >
          Enter Command Center
          <ArrowRight className="h-5 w-5" />
        </Link>
      </div>

      {/* Features Grid */}
      <div className="mt-16 grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-3">
        {[
          { icon: Brain, label: "AI Command Center", desc: "Gemini-powered insights" },
          { icon: MessageSquare, label: "Fan Assistant", desc: "7 languages, voice" },
          { icon: Users, label: "Crowd Intelligence", desc: "Predictive analytics" },
          { icon: Shield, label: "Incident Response", desc: "AI triage & dispatch" },
          { icon: Leaf, label: "Sustainability", desc: "Green monitoring" },
          { icon: Bus, label: "Transport AI", desc: "Smart routing" },
        ].map((feature) => (
          <div
            key={feature.label}
            className="glass-card flex flex-col items-center p-4 text-center"
          >
            <feature.icon className="mb-2 h-6 w-6 text-accent-blue" aria-hidden="true" />
            <p className="text-xs font-semibold text-text-primary">{feature.label}</p>
            <p className="text-[10px] text-text-muted">{feature.desc}</p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <p className="mt-12 text-xs text-text-muted">
        Built for FIFA World Cup 2026 • Powered by Google Gemini AI
      </p>
    </div>
  );
}
