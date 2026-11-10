"use client";

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
  cyan:    "var(--db-cyan)",
  violet:  "var(--db-violet)",
  emerald: "var(--db-green)",
};

export default function FeatureCard({
  icon,
  title,
  description,
  href,
  accent = "cyan",
  soon = false,
}: FeatureCardProps) {
  const color = ACCENT[accent];

  const inner = (
    <div
      className="arcade-panel"
      style={{
        height: "100%",
        borderColor: soon ? "var(--db-muted)" : color,
        cursor: soon ? "default" : "pointer",
        display: "flex",
        flexDirection: "column",
        opacity: soon ? 0.72 : 1,
      }}
    >
      {/* Title bar */}
      <div
        className="arcade-panel__bar"
        style={{
          background: soon ? "var(--db-muted)" : color,
          borderBottomColor: soon ? "var(--db-muted)" : color,
        }}
      >
        <span>{title}</span>
        {soon && <span className="blink">Soon</span>}
      </div>

      <div
        style={{
          flex: 1,
          padding: "1.5rem",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        {/* Icon */}
        <div
          style={{
            width: "44px",
            height: "44px",
            border: `3px solid ${color}`,
            boxShadow: "3px 3px 0 #000",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.2rem",
            color,
            flexShrink: 0,
          }}
        >
          {icon}
        </div>

        {/* Text */}
        <p
          style={{
            flex: 1,
            fontFamily: "var(--font-sans)",
            fontSize: "0.875rem",
            color: "var(--db-stone)",
            margin: 0,
            lineHeight: 1.6,
          }}
        >
          {description}
        </p>

        {/* Arrow */}
        {!soon && (
          <div
            className="arcade-label"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              color,
            }}
          >
            <span>explore</span>
            <span>→</span>
          </div>
        )}
      </div>
    </div>
  );

  if (soon) return <div style={{ height: "100%" }}>{inner}</div>;
  return (
    <Link href={href} className="arcade-card-link" style={{ textDecoration: "none", display: "block", height: "100%" }}>
      {inner}
    </Link>
  );
}
