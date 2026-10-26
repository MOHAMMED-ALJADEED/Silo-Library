import React from "react";
import { motion } from "framer-motion";

const stroke = { stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" };

export default function MenuIcon({ open, className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      {/* Top bar: medium length (right aligned) */}
      <motion.line
        {...stroke}
        initial={false}
        animate={open ? { x1: 6, y1: 6, x2: 18, y2: 18 } : { x1: 9, y1: 7, x2: 22, y2: 7 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      />
      {/* Middle bar: longest length */}
      <motion.line
        {...stroke}
        initial={false}
        animate={
          open
            ? { x1: 12, y1: 12, x2: 12, y2: 12, opacity: 0 }
            : { x1: 2, y1: 12, x2: 22, y2: 12, opacity: 1 }
        }
        transition={{ duration: 0.25, ease: "easeInOut" }}
      />
      {/* Bottom bar: short length */}
      <motion.line
        {...stroke}
        initial={false}
        animate={open ? { x1: 6, y1: 18, x2: 18, y2: 6 } : { x1: 13, y1: 17, x2: 22, y2: 17 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      />
    </svg>
  );
}