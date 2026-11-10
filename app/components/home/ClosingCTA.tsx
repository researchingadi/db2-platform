"use client";

import Link from "next/link";
import { MotionConfig, motion } from "framer-motion";

export default function ClosingCTA() {
  return (
    <section
      style={{
        padding: "80px 24px 100px",
        textAlign: "center",
        background: "var(--db-black)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <MotionConfig reducedMotion="user">
        <div
          className="arcade-panel"
          style={{ position: "relative", zIndex: 1, maxWidth: "820px", margin: "0 auto", padding: "0 28px 36px" }}
        >
          {/* Title bar: the existing eyebrow line */}
          <p className="arcade-panel__bar" style={{ justifyContent: "center", display: "flex", margin: "0 -28px 32px" }}>
            Open Science · Open Data
          </p>
          <h2
            className="arcade-title"
            style={{
              fontSize: "clamp(1.15rem, 3.2vw, 2rem)",
              margin: 0,
              lineHeight: 1.4,
            }}
          >
            The genome of a beetle.
          </h2>
          <h2
            className="arcade-title"
            style={{
              fontSize: "clamp(1.15rem, 3.2vw, 2rem)",
              color: "var(--db-cyan)",
              margin: "6px 0 0",
              lineHeight: 1.4,
            }}
          >
            A window into evolution.
          </h2>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "1rem",
              color: "var(--db-stone)",
              maxWidth: "520px",
              margin: "24px auto 0",
              lineHeight: 1.8,
            }}
          >
            DB² is an open platform built for researchers, educators, and anyone
            curious about the genomics of adaptation. All data is freely
            accessible.
          </p>

          <div
            style={{
              display: "flex",
              gap: "16px",
              justifyContent: "center",
              flexWrap: "wrap",
              marginTop: "36px",
            }}
          >
            <Link href="/genome-browser" className="focus-ring" style={{ textDecoration: "none" }}>
              <motion.span className="arcade-btn" style={{ padding: "0.9rem 1.2rem" }}>
                Explore the Genome Browser
              </motion.span>
            </Link>
            <Link href="/downloads" className="focus-ring" style={{ textDecoration: "none" }}>
              <motion.span className="arcade-btn" style={{ padding: "0.9rem 1.2rem" }}>
                Browse All Species
              </motion.span>
            </Link>
          </div>

          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "14px",
              color: "var(--db-stone)",
              lineHeight: 1.6,
              marginTop: "40px",
            }}
          >
            Genome data from NCBI · Occurrence data from iNaturalist · Literature from Europe PMC
          </p>
        </div>
      </MotionConfig>
    </section>
  );
}
