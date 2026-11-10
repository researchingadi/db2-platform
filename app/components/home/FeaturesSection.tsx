"use client";

import Link from "next/link";
import { MotionConfig, motion, useInView } from "framer-motion";
import { useRef } from "react";

const FEATURES = [
  {
    icon: "🔬",
    accent: "var(--db-cyan)",
    title: "Genome Browser",
    description:
      "Interactive JBrowse 2 viewer with chromosome assembly, NCBI annotations, and Davidson Lab custom tracks across all four species.",
    href: "/genome-browser",
  },
  {
    icon: "🌍",
    accent: "var(--db-green)",
    title: "Distribution Map",
    description:
      "Explore global Scarabaeinae observations from the iNaturalist community science network with live API data.",
    href: "/distribution",
  },
  {
    icon: "📚",
    accent: "var(--db-cyan)",
    title: "Literature",
    description:
      "Real-time search across Onthophagus and dung beetle genomics publications, powered by Europe PMC.",
    href: "/literature",
  },
  {
    icon: "⬇️",
    accent: "var(--db-green)",
    title: "Downloads",
    description:
      "Genome assemblies, GFF3/GTF annotations, masked genomes, protein and nucleotide sequences for all four species.",
    href: "/downloads",
  },
  {
    icon: "👥",
    accent: "var(--db-cyan)",
    title: "People",
    description:
      "Davidson Lab team and collaborating principal investigators across Boston University, Indiana University, Southwest University, and UC San Diego.",
    href: "/people",
  },
  {
    icon: "📖",
    accent: "var(--db-green)",
    title: "Publications",
    description:
      "Davidson Lab publications and key dung beetle genomics literature with DOI links and dataset references.",
    href: "/publications",
  },
];

export default function FeaturesSection() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section style={{ padding: "80px 24px", background: "var(--db-black)" }}>
      <MotionConfig reducedMotion="user">
        <div style={{ maxWidth: "1200px", margin: "0 auto" }} ref={ref}>
          <p className="db-eyebrow">Platform Tools</p>
          <h2
            className="arcade-title"
            style={{
              fontSize: "clamp(1.15rem, 2.7vw, 1.8rem)",
              lineHeight: 1.35,
              marginTop: "14px",
            }}
          >
            Everything You Need to Explore Beetle Genomics.
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(min(300px, 100%), 1fr))",
              gap: "24px",
              marginTop: "2.5rem",
            }}
          >
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ y: 20, opacity: 0 }}
                animate={inView ? { y: 0, opacity: 1 } : {}}
                transition={{ delay: i * 0.06, duration: 0.5, ease: [0.22, 0.61, 0.36, 1] }}
                className="arcade-panel arcade-hover"
                style={{
                  position: "relative",
                  padding: "0 22px 22px",
                  cursor: "pointer",
                }}
              >
                <Link href={f.href} className="focus-ring" style={{ textDecoration: "none", color: "inherit", display: "block" }}>
                  {/* Icon tile sits on the right of the title bar */}
                  <div
                    style={{
                      position: "absolute",
                      top: "-4px",
                      right: "-4px",
                      width: "44px",
                      height: "44px",
                      border: `var(--arcade-border) solid ${f.accent}`,
                      background: "var(--db-black)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.2rem",
                    }}
                  >
                    {f.icon}
                  </div>
                  <div
                    className="arcade-panel__bar"
                    style={{
                      margin: "0 -22px 16px",
                      minHeight: "40px",
                      paddingRight: "56px",
                    }}
                  >
                    {f.title}
                  </div>
                  <p
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "15px",
                      color: "var(--db-stone)",
                      lineHeight: 1.6,
                      margin: 0,
                    }}
                  >
                    {f.description}
                  </p>
                  <div
                    className="pixel-glyphs"
                    style={{
                      color: f.accent,
                      fontSize: "0.58rem",
                      lineHeight: 1.5,
                      textTransform: "uppercase",
                      marginTop: "16px",
                    }}
                  >
                    Open →
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </MotionConfig>
    </section>
  );
}
