"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function IntroSection() {
  return (
    <section
      style={{
        background: "var(--db-black)",
        padding: "clamp(4rem, 10vw, 8rem) 6%",
      }}
    >
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.22, 0.61, 0.36, 1] }}
        style={{ maxWidth: "1100px", margin: "0 auto" }}
      >
        <p className="db-eyebrow" style={{ marginBottom: "16px" }}>
          Davidson Lab · Mississippi State University
        </p>
        <h1
          style={{
            fontFamily: "var(--font-sans)",
            fontWeight: 700,
            fontSize: "clamp(2.8rem, 6vw, 5.5rem)",
            color: "var(--db-cream)",
            lineHeight: 1.05,
            letterSpacing: "-0.04em",
            margin: 0,
          }}
        >
          Advancing Dung Beetle
          <br />
          <span
            style={{
              background: "linear-gradient(135deg, #00f0ff, #49ffb6)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Genomics
          </span>
        </h1>
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontWeight: 400,
            fontSize: "1.05rem",
            color: "var(--db-stone)",
            maxWidth: "460px",
            lineHeight: 1.75,
            marginTop: "18px",
          }}
        >
          Comprehensive genomic resources for Onthophagus taurus, supporting
          research in evolution, ecology, and adaptation.
        </p>
        <div style={{ display: "flex", gap: "12px", marginTop: "28px", flexWrap: "wrap" }}>
          <Link href="/genome-browser" style={{ textDecoration: "none" }}>
            <motion.span
              whileHover={{ scale: 1.03, boxShadow: "0 0 32px rgba(0,240,255,0.4)" }}
              style={{
                display: "inline-block",
                background: "var(--db-cyan)",
                color: "#030303",
                fontFamily: "var(--font-sans)",
                fontWeight: 600,
                fontSize: "0.8rem",
                letterSpacing: "0.06em",
                padding: "12px 26px",
                borderRadius: "8px",
              }}
            >
              Explore Genome Browser
            </motion.span>
          </Link>
          <Link href="/literature" style={{ textDecoration: "none" }}>
            <motion.span
              whileHover={{ scale: 1.03 }}
              style={{
                display: "inline-block",
                background: "transparent",
                color: "var(--db-cyan)",
                border: "1px solid rgba(0,240,255,0.4)",
                fontFamily: "var(--font-sans)",
                fontWeight: 600,
                fontSize: "0.8rem",
                letterSpacing: "0.06em",
                padding: "12px 26px",
                borderRadius: "8px",
              }}
            >
              Browse Literature
            </motion.span>
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
