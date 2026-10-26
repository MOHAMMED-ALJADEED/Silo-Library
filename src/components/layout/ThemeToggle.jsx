import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label="Toggle dark mode"
      title="Toggle dark mode"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative inline-flex items-center h-8 w-14 rounded-full border border-border bg-muted transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      {/* Track icons (faint background hints) */}
      <Sun className="absolute left-1.5 w-3.5 h-3.5 text-amber-500/70" aria-hidden="true" />
      <Moon className="absolute right-1.5 w-3.5 h-3.5 text-indigo-400/70" aria-hidden="true" />

      {/* Sliding handle */}
      <span
        className={`absolute top-1/2 -translate-y-1/2 flex items-center justify-center w-6 h-6 rounded-full bg-card shadow-sm transition-all duration-300 ease-in-out ${
          isDark ? "left-[calc(100%-1.75rem)]" : "left-0.5"
        }`}
      >
        {isDark ? (
          <Moon className="w-3.5 h-3.5 text-indigo-400" />
        ) : (
          <Sun className="w-3.5 h-3.5 text-amber-500" />
        )}
      </span>
    </button>
  );
}