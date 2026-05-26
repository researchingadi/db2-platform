"use client";

import { motion } from "framer-motion";
import Link from "next/link";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  accent?: "cyan" | "violet" | "emerald";
  soon?: boolean;
}

const ACCENT = {
  cyan:    { border: "rgba(34,211,238,0.18)",  glow: "rgba(34,211,238,0.15)",  text: "#22d3ee" },
  violet:  { border: "rgba(129,140,248,0.18)", glow: "rgba(129,140,248,0.15)", text: "#818cf8" },
  emerald: { border: "rgba(16,185,129,0.18)",  glow: "rgba(16,185,129,0.15)",  text: "#10b981" },
};

export default function FeatureCard({
  icon,
  title,
  description,
  href,
  accent = "cyan",
  soon = false,
}: FeatureCardProps) {
  const a = ACCENT[accent];

  const inner = (
    <motion.div
      whileHover={soon ? {} : {
        scale: 1.025,
        y: -4,
        borderColor: a.border.replace("0.18", "0.5"),
        boxShadow: `0 0 24px ${a.glow}, 0 16px 40px rgba(0,0,0,0.4)`,
      }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      style={{
        position: "relative",
        height: "100%",
        padding: "1.75rem",
        borderRadius: "16px",
        background: "rgba(9,13,26,0.75)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: `1px solid ${a.border}`,
        cursor: soon ? "default" : "pointer",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      {/* top gradient glow */}
      <div style={{
        position: "absolute",
        top: 0, left: 0, right: 0,
        height: "1px",
        background: `linear-gradient(90deg, transparent, ${a.text}, transparent)`,
        opacity: 0.6,
      }} />

      {/* Icon */}
      <div style={{
        width: "44px", height: "44px",
        borderRadius: "10px",
        background: `rgba(${accent === "cyan" ? "34,211,238" : accent === "violet" ? "129,140,248" : "16,185,129"}, 0.1)`,
        border: `1px solid ${a.border}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "1.2rem",
        color: a.text,
        flexShrink: 0,
      }}>
        {icon}
      </div>

      {/* Text */}
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
          <h3 style={{
            fontFamily: "var(--font-sans)",
            fontWeight: 600,
            fontSize: "1rem",
            color: "#e2e8f0",
            margin: 0,
          }}>
            {title}
          </h3>
          {soon && (
            <span style={{
              padding: "2px 8px",
              borderRadius: "4px",
              fontSize: "0.65rem",
              fontFamily: "var(--font-mono)",
              fontWeight: 500,
              color: "#818cf8",
              background: "rgba(129,140,248,0.1)",
              border: "1px solid rgba(129,140,248,0.2)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}>
              Soon
            </span>
          )}
        </div>
        <p style={{
          fontFamily: "var(--font-sans)",
          fontSize: "0.875rem",
          color: "#64748b",
          margin: 0,
          lineHeight: 1.6,
        }}>
          {description}
        </p>
      </div>

      {/* Arrow */}
      {!soon && (
        <motion.div
          whileHover={{ x: 4 }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            color: a.text,
            fontSize: "0.8rem",
            fontFamily: "var(--font-mono)",
            letterSpacing: "0.05em",
          }}
        >
          <span>explore</span>
          <span style={{ fontSize: "1rem" }}>→</span>
        </motion.div>
      )}
    </motion.div>
  );

  if (soon) return <div style={{ height: "100%" }}>{inner}</div>;
  return <Link href={href} style={{ textDecoration: "none", display: "block", height: "100%" }}>{inner}</Link>;
}
