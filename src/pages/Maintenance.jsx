import React from "react";
import { Activity, HeartPulse } from "lucide-react";

export default function Maintenance() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6 relative overflow-hidden">
      {/* ambient glow */}
      <div className="pointer-events-none absolute -top-40 -left-40 w-96 h-96 rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative z-10 max-w-xl w-full text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20 mb-8">
          <HeartPulse className="w-10 h-10 text-primary animate-pulse" />
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-6">
          <Activity className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs font-semibold tracking-wide text-primary uppercase">Maintenance Mode</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight leading-tight">
          Sorry, the site is currently<br className="hidden sm:block" /> under maintenance.
        </h1>
        <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
          We will be back soon!
        </p>

        <div className="mt-10 flex items-center justify-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
          <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
          <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  );
}