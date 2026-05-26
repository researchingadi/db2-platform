"use client";

import { motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useRef, useState } from "react";
import BeetleHeroBackground from "./BeetleHeroBackground";

const states = [
  {
    kicker: "DB²",
    title: "The Dung Beetle Genome Database",
    copy: "A cinematic genome and transcriptomics platform for Onthophagus taurus.",
  },
  {
    kicker: "Onthophagus taurus",
    title: "Chromosome-scale biological infrastructure",
    copy: "Reference assembly, gene models, annotation tracks, and future expression layers.",
  },
  {
    kicker: "Genome · Annotation · RNA-seq",
    title: "A research interface for discovery",
    copy: "Built to make complex dung beetle genomic data explorable, navigable, and usable.",
  },
  {
    kicker: "Open the genome",
    title: "Launch the browser",
    copy: "Move from cinematic overview to real genome coordinates through JBrowse 2.",
  },
];

export default function CinematicHero() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const videoScale = useTransform(scrollYProgress, [0, 0.4, 1], [1.08, 1, 0.92]);
  const mediaOpacity = useTransform(scrollYProgress, [0, 0.82, 1], [1, 1, 0.35]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -120]);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setProgress(latest);
    const next = Math.min(states.length - 1, Math.floor(latest * states.length));
    setStep(next);
  });

  const current = states[step];

  return (
    <section ref={ref} style={{ position: "relative", height: "430vh" }}>
      <div
        style={{
          position: "sticky",
          top: 0,
          minHeight: "100vh",
          overflow: "hidden",
          background: "var(--db-black)",
        }}
      >
        <motion.div
  style={{
    position: "absolute",
    inset: 0,
    scale: videoScale,
    opacity: mediaOpacity,
  }}
>
  <BeetleHeroBackground />
</motion.div>

        <div className="db-grid" style={{ position: "absolute", inset: 0, opacity: 0.18 }} />
        <div className="db-grain" style={{ position: "absolute", inset: 0, opacity: 0.45 }} />
        <div className="db-scanlines" style={{ position: "absolute", inset: 0 }} />

        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(90deg, rgba(3,3,3,0.92) 0%, rgba(3,3,3,0.55) 42%, rgba(3,3,3,0.16) 100%), linear-gradient(to bottom, rgba(3,3,3,0.22), rgba(3,3,3,0.78))",
          }}
        />

        <motion.div
          style={{
            position: "relative",
            zIndex: 2,
            minHeight: "100vh",
            display: "flex",
            alignItems: "flex-end",
            maxWidth: "1540px",
            margin: "0 auto",
            padding: "8rem 1.25rem 5rem",
            y: textY,
          }}
        >
          <div style={{ width: "100%" }}>
            <motion.div
              key={current.kicker}
              initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.55, ease: [0.22, 0.61, 0.36, 1] }}
              style={{ maxWidth: "980px" }}
            >
              <div className="db-pill" style={{ marginBottom: "1.4rem" }}>
                <span className="db-dot" />
                {current.kicker}
              </div>

              <h1
                className="db-scroll-text"
                style={{
                  margin: 0,
                  maxWidth: "1050px",
                  color: "var(--db-cream)",
                }}
              >
                {current.title}
              </h1>

              <p
                style={{
                  maxWidth: "48ch",
                  color: "var(--db-stone)",
                  lineHeight: 1.8,
                  fontSize: "clamp(1rem, 1.5vw, 1.2rem)",
                  margin: "1.4rem 0 2rem",
                }}
              >
                {current.copy}
              </p>
            </motion.div>

            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <Link href="/genome-browser" className="db-magnetic-link">
                Launch Genome Browser
              </Link>
              <Link href="/downloads" className="db-magnetic-link">
                Download Data
              </Link>
            </div>

            <div
              style={{
                marginTop: "3rem",
                display: "grid",
                gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                gap: "0.75rem",
                maxWidth: "780px",
              }}
              className="hero-meta-grid"
            >
              {["Otau_3.2", "12 chromosomes", "28,456 genes", "JBrowse 2"].map((item) => (
                <div
                  key={item}
                  className="db-glass"
                  style={{
                    padding: "0.85rem",
                    borderRadius: "14px",
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.66rem",
                    color: "var(--db-stone)",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <div
          style={{
            position: "absolute",
            right: "1.25rem",
            bottom: "1.25rem",
            zIndex: 3,
            fontFamily: "var(--font-mono)",
            fontSize: "0.62rem",
            letterSpacing: "0.14em",
            color: "var(--db-muted)",
            textTransform: "uppercase",
          }}
        >
          Scroll to scrub / {String(step + 1).padStart(2, "0")} · 04
        </div>
      </div>
    </section>
  );
}