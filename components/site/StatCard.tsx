"use client";

import { motion } from "framer-motion";

interface StatCardProps {
  value: string;
  label: string;
  accent?: "cyan" | "violet" | "emerald";
  delay?: number;
}

const ACCENT_COLOR = {
  cyan:    "var(--db-cyan)",
  violet:  "var(--db-violet)",
  emerald: "var(--db-green)",
};

export default function StatCard({ value, label, accent = "cyan", delay = 0 }: StatCardProps) {
  const color = ACCENT_COLOR[accent];
  return (
    <motion.div
      className="arcade-panel"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay, ease: "linear" }}
      style={{
        padding: "1.25rem 1.25rem 1rem",
        borderColor: color,
        textAlign: "center",
        flex: 1,
        minWidth: "120px",
      }}
    >
      <div
        className="arcade-title"
        style={{
          fontSize: "clamp(1rem, 2vw, 1.5rem)",
          color,
          lineHeight: 1.2,
        }}
      >
        {value}
      </div>
      <div
        className="arcade-label"
        style={{
          color: "var(--db-stone)",
          marginTop: "10px",
        }}
      >
        {label}
      </div>
    </motion.div>
  );
}
