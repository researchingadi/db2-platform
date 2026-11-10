"use client";

import Link from "next/link";
import { MotionConfig, motion } from "framer-motion";

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
    <section style={{ padding: "80px 24px", background: "var(--db-black)" }}>
      <MotionConfig reducedMotion="user">
        <div
          className="arcade-panel assembly-card-grid"
          style={{
            position: "relative",
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0 48px 40px",
            display: "grid",
            gridTemplateColumns: "1fr",
            overflow: "hidden",
          }}
        >
          <div style={{ minWidth: 0 }}>
            {/* Title bar: the existing "Featured Assembly" eyebrow */}
            <p className="arcade-panel__bar" style={{ margin: "0 -48px 28px" }}>
              Featured Assembly
            </p>
            <h2
              className="arcade-title"
              style={{
                fontSize: "clamp(1.05rem, 2.4vw, 1.5rem)",
                lineHeight: 1.4,
                margin: 0,
                overflowWrap: "anywhere",
              }}
            >
              Onthophagus taurus · Otau_3.2
            </h2>
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "15px",
                color: "var(--db-cyan)",
                marginTop: "12px",
              }}
            >
              GCF_036711975.1
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0,1fr))",
                gap: "18px 24px",
                marginTop: "28px",
                maxWidth: "520px",
              }}
            >
              {SPECS.map((spec) => (
                <div key={spec.label} style={{ borderLeft: "var(--arcade-border) solid var(--db-cyan)", paddingLeft: "12px" }}>
                  <div
                    style={{
                      fontFamily: "var(--font-pixel)",
                      fontSize: "0.5rem",
                      lineHeight: 1.6,
                      textTransform: "uppercase",
                      color: "var(--db-stone)",
                    }}
                  >
                    {spec.label}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontWeight: 600,
                      fontSize: "15px",
                      color: "var(--db-cream)",
                      marginTop: "6px",
                    }}
                  >
                    {spec.value}
                  </div>
                </div>
              ))}
            </div>

            <Link href="/genome-browser" className="focus-ring" style={{ textDecoration: "none", display: "inline-block", marginTop: "32px" }}>
              <motion.span className="arcade-btn pixel-glyphs">
                Open Genome Browser →
              </motion.span>
            </Link>
          </div>

          <div
            className="assembly-card-vertical"
            style={{
              position: "absolute",
              top: "72px",
              right: "20px",
              fontFamily: "var(--font-mono)",
              color: "var(--db-stone)",
              fontSize: "14px",
              letterSpacing: "0.15em",
              writingMode: "vertical-rl",
              textOrientation: "mixed",
            }}
          >
            GCF_036711975.1
          </div>
        </div>
      </MotionConfig>

      <style>{`
        @media (max-width: 768px) {
          .assembly-card-grid { grid-template-columns: 1fr !important; padding-left: 22px !important; padding-right: 22px !important; }
          .assembly-card-grid .arcade-panel__bar { margin-left: -22px !important; margin-right: -22px !important; }
          .assembly-card-vertical { display: none; }
        }
      `}</style>
    </section>
  );
}
