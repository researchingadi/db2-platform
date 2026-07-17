"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const SPECS = [
  { label: "Assembly Level", value: "Chromosome" },
  { label: "Chromosomes", value: "12" },
  { label: "Genome Size", value: "~295 Mb" },
  { label: "Primary Annotation", value: "NCBI RefSeq" },
  { label: "Custom Annotation", value: "Davidson Lab" },
  { label: "Source", value: "NCBI" },
];

export default function AssemblyCard() {
  return (
    <section style={{ padding: "72px 24px", background: "var(--db-black)" }}>
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          background: "linear-gradient(135deg, var(--db-charcoal), var(--db-panel))",
          border: "1px solid rgba(0,240,255,0.2)",
          borderRadius: "16px",
          padding: "40px 48px",
          display: "grid",
          gridTemplateColumns: "1fr auto",
          gap: "40px",
          alignItems: "center",
          overflow: "hidden",
        }}
        className="assembly-card-grid"
      >
        <div>
          <p className="db-eyebrow">Featured Assembly</p>
          <h2
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 700,
              fontSize: "1.8rem",
              color: "var(--db-cream)",
              letterSpacing: "-0.03em",
              margin: 0,
            }}
          >
            Onthophagus taurus · Otau_3.2
          </h2>
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "12px",
              color: "var(--db-muted)",
              marginTop: "6px",
            }}
          >
            GCF_036711975.1
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0,1fr))",
              gap: "12px",
              marginTop: "24px",
              maxWidth: "460px",
            }}
          >
            {SPECS.map((spec) => (
              <div key={spec.label}>
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "10px",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    color: "var(--db-muted)",
                  }}
                >
                  {spec.label}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontWeight: 500,
                    fontSize: "13px",
                    color: "var(--db-stone)",
                    marginTop: "2px",
                  }}
                >
                  {spec.value}
                </div>
              </div>
            ))}
          </div>

          <Link href="/genome-browser" style={{ textDecoration: "none" }}>
            <motion.span
              whileHover={{ scale: 1.03 }}
              style={{
                display: "inline-block",
                background: "var(--db-cyan)",
                color: "#030303",
                fontFamily: "var(--font-sans)",
                fontWeight: 600,
                fontSize: "13px",
                padding: "10px 22px",
                borderRadius: "8px",
                marginTop: "28px",
              }}
            >
              Open Genome Browser →
            </motion.span>
          </Link>
        </div>

        <div
          className="assembly-card-vertical"
          style={{
            fontFamily: "var(--font-mono)",
            color: "rgba(0,240,255,0.08)",
            fontSize: "11px",
            letterSpacing: "0.15em",
            writingMode: "vertical-rl",
            textOrientation: "mixed",
          }}
        >
          GCF_036711975.1
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .assembly-card-grid { grid-template-columns: 1fr !important; }
          .assembly-card-vertical { display: none; }
        }
      `}</style>
    </section>
  );
}
