import React, { useState, useEffect, useRef, useCallback } from "react";

// One continuous, unbroken ECG trace — four QRS complexes across the width.
const ECG_PATH =
  "M0,30 L120,30 L128,28 L133,5 L138,55 L143,28 L150,30 L420,30 L428,28 L433,5 " +
  "L438,55 L443,28 L450,30 L720,30 L728,28 L733,5 L738,55 L743,28 L750,30 " +
  "L1020,30 L1028,28 L1033,5 L1038,55 L1043,28 L1050,30 L1200,30";

// dash pattern length = head + gap (must match the @keyframes ecgSweep end value)
const PATTERN = 2050;

export default function ECGLine() {
  const [active, setActive] = useState(false);
  const ticking = useRef(false);
  const scrollTimer = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        setActive(true);
        clearTimeout(scrollTimer.current);
        scrollTimer.current = setTimeout(() => setActive(false), 800);
        ticking.current = false;
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimer.current);
    };
  }, []);

  const handleEnter = useCallback(() => setActive(true), []);
  const handleLeave = useCallback(() => setActive(false), []);

  const glowColor = active ? "#b388ff" : "#8C52FF";
  const dur = active ? "2.2s" : "3.4s";

  return (
    <div
      className="w-full overflow-hidden pointer-events-none select-none"
      style={{ height: 60 }}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <svg
        viewBox="0 0 1200 60"
        preserveAspectRatio="none"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="ecgFade" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={glowColor} stopOpacity="0" />
            <stop offset="12%" stopColor={glowColor} stopOpacity="1" />
            <stop offset="88%" stopColor={glowColor} stopOpacity="1" />
            <stop offset="100%" stopColor={glowColor} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Base trace — continuous, always visible, neon glow */}
        <path
          d={ECG_PATH}
          fill="none"
          stroke="url(#ecgFade)"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            opacity: 0.9,
            filter: `drop-shadow(0 0 6px ${glowColor}) drop-shadow(0 0 12px ${glowColor})`,
          }}
        />

        {/* Scanning pulse head — short bright dash sweeping right-to-left */}
        <path
          d={ECG_PATH}
          fill="none"
          stroke={glowColor}
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            strokeDasharray: `44 ${PATTERN - 44}`,
            strokeDashoffset: 0,
            animation: `ecgSweep ${dur} linear infinite`,
            willChange: "stroke-dashoffset",
            filter: `drop-shadow(0 0 8px ${glowColor}) drop-shadow(0 0 16px ${glowColor})`,
          }}
        />
      </svg>

      <style>{`
        @keyframes ecgSweep {
          from { stroke-dashoffset: 0; }
          to   { stroke-dashoffset: ${PATTERN}; }
        }
      `}</style>
    </div>
  );
}