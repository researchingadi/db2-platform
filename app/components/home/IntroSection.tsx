"use client";

import Link from "next/link";
import { MotionConfig, motion } from "framer-motion";

export default function IntroSection() {
  return (
    <section
      style={{
        background: "var(--db-black)",
        padding: "clamp(4rem, 10vw, 8rem) 6%",
      }}
    >
      {/* reducedMotion="user": the entrance animation honours prefers-reduced-motion */}
      <MotionConfig reducedMotion="user">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 0.61, 0.36, 1] }}
          style={{ maxWidth: "1100px", margin: "0 auto" }}
        >
          <p className="db-eyebrow" style={{ marginBottom: "20px" }}>
            Davidson Lab · Mississippi State University
          </p>
          <h1
            className="arcade-title"
            style={{
              fontSize: "clamp(1.6rem, 4.6vw, 3.4rem)",
              lineHeight: 1.25,
              margin: 0,
              overflowWrap: "anywhere",
            }}
          >
            Advancing Dung Beetle
            <br />
            <span style={{ color: "var(--db-cyan)" }}>Genomics</span>
          </h1>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 400,
              fontSize: "1.05rem",
              color: "var(--db-stone)",
              maxWidth: "520px",
              lineHeight: 1.75,
              marginTop: "24px",
            }}
          >
            Comprehensive genomic resources for Onthophagus taurus, supporting
            research in evolution, ecology, and adaptation.
          </p>
          <div style={{ display: "flex", gap: "16px", marginTop: "32px", flexWrap: "wrap" }}>
            <Link href="/genome-browser" className="focus-ring" style={{ textDecoration: "none" }}>
              <motion.span className="arcade-btn arcade-btn--cta" style={{ padding: "0.9rem 1.2rem" }}>
                Explore Genome Browser
              </motion.span>
            </Link>
            <Link href="/literature" className="focus-ring" style={{ textDecoration: "none" }}>
              <motion.span className="arcade-btn" style={{ padding: "0.9rem 1.2rem" }}>
                Browse Literature
              </motion.span>
            </Link>
          </div>
        </motion.div>
      </MotionConfig>
    </section>
  );
}
