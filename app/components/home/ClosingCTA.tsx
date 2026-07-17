"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function ClosingCTA() {
  return (
    <section
      style={{
        padding: "100px 24px",
        textAlign: "center",
        background: "var(--db-black)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(141,124,255,0.08), transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", zIndex: 1 }}>
        <p className="db-eyebrow" style={{ justifyContent: "center", display: "flex" }}>
          Open Science · Open Data
        </p>
        <h2
          style={{
            fontFamily: "var(--font-sans)",
            fontWeight: 700,
            fontSize: "clamp(2.2rem, 5vw, 4rem)",
            color: "var(--db-cream)",
            margin: 0,
            lineHeight: 1.1,
          }}
        >
          The genome of a beetle.
        </h2>
        <h2
          style={{
            fontFamily: "var(--font-serif)",
            fontStyle: "italic",
            fontWeight: 700,
            fontSize: "clamp(2.2rem, 5vw, 4rem)",
            color: "var(--db-violet)",
            margin: 0,
            lineHeight: 1.1,
          }}
        >
          A window into evolution.
        </h2>
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "1rem",
            color: "var(--db-stone)",
            maxWidth: "480px",
            margin: "20px auto 0",
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
            gap: "14px",
            justifyContent: "center",
            flexWrap: "wrap",
            marginTop: "36px",
          }}
        >
          <Link href="/genome-browser" style={{ textDecoration: "none" }}>
            <motion.span
              whileHover={{ scale: 1.03 }}
              style={{
                display: "inline-block",
                background: "var(--db-violet)",
                color: "#030303",
                fontFamily: "var(--font-sans)",
                fontWeight: 600,
                fontSize: "0.85rem",
                letterSpacing: "0.04em",
                padding: "13px 28px",
                borderRadius: "9px",
              }}
            >
              Explore the Genome Browser
            </motion.span>
          </Link>
          <Link href="/downloads" style={{ textDecoration: "none" }}>
            <motion.span
              whileHover={{ borderColor: "#8d7cff" }}
              style={{
                display: "inline-block",
                background: "transparent",
                color: "var(--db-violet)",
                border: "1px solid rgba(141,124,255,0.4)",
                fontFamily: "var(--font-sans)",
                fontWeight: 600,
                fontSize: "0.85rem",
                letterSpacing: "0.04em",
                padding: "13px 28px",
                borderRadius: "9px",
              }}
            >
              Browse All Species
            </motion.span>
          </Link>
        </div>

        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.65rem",
            color: "var(--db-muted)",
            letterSpacing: "0.1em",
            marginTop: "56px",
          }}
        >
          Genome data from NCBI · Occurrence data from iNaturalist · Literature from Europe PMC
        </p>
      </div>
    </section>
  );
}
