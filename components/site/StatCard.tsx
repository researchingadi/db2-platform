"use client";

import { motion } from "framer-motion";

interface StatCardProps {
  value: string;
  label: string;
  accent?: "cyan" | "violet" | "emerald";
  delay?: number;
}

const ACCENT_COLOR = {
  cyan:    "#22d3ee",
  violet:  "#818cf8",
  emerald: "#10b981",
};

export default function StatCard({ value, label, accent = "cyan", delay = 0 }: StatCardProps) {
  const color = ACCENT_COLOR[accent];
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.4, 0.25, 1] }}
      whileHover={{ scale: 1.04 }}
      style={{
        padding: "1.25rem 1.5rem",
        borderRadius: "12px",
        background: "rgba(9,13,26,0.8)",
        border: `1px solid rgba(26,34,64,0.8)`,
        borderTop: `2px solid ${color}`,
        textAlign: "center",
        flex: 1,
        minWidth: "120px",
      }}
    >
      <div style={{
        fontFamily: "var(--font-mono)",
        fontWeight: 500,
        fontSize: "clamp(1.4rem, 2.5vw, 2rem)",
        color,
        lineHeight: 1.1,
        letterSpacing: "-0.03em",
      }}>
        {value}
      </div>
      <div style={{
        fontFamily: "var(--font-sans)",
        fontSize: "0.75rem",
        color: "#64748b",
        marginTop: "6px",
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        fontWeight: 500,
      }}>
        {label}
      </div>
    </motion.div>
  );
}
