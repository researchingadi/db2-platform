"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const FEATURES = [
  {
    icon: "🔬",
    bg: "rgba(0,240,255,0.12)",
    title: "Genome Browser",
    description:
      "Interactive JBrowse 2 viewer with chromosome assembly, NCBI annotations, and Davidson Lab custom tracks across all four species.",
    href: "/genome-browser",
  },
  {
    icon: "🌍",
    bg: "rgba(73,255,182,0.1)",
    title: "Distribution Map",
    description:
      "Explore global Scarabaeinae observations from the iNaturalist community science network with live API data.",
    href: "/distribution",
  },
  {
    icon: "📚",
    bg: "rgba(0,240,255,0.1)",
    title: "Literature",
    description:
      "Real-time search across Onthophagus and dung beetle genomics publications, powered by Europe PMC.",
    href: "/literature",
  },
  {
    icon: "⬇️",
    bg: "rgba(73,255,182,0.1)",
    title: "Downloads",
    description:
      "Genome assemblies, GFF3/GTF annotations, masked genomes, protein and nucleotide sequences for all four species.",
    href: "/downloads",
  },
  {
    icon: "👥",
    bg: "rgba(0,240,255,0.1)",
    title: "People",
    description:
      "Davidson Lab team and collaborating principal investigators across Boston University, Indiana University, Southwest University, and UC San Diego.",
    href: "/people",
  },
  {
    icon: "📖",
    bg: "rgba(73,255,182,0.1)",
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
    <section style={{ padding: "72px 24px", background: "var(--db-black)" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }} ref={ref}>
        <p className="db-eyebrow">Platform Tools</p>
        <h2
          style={{
            fontFamily: "var(--font-sans)",
            fontWeight: 700,
            fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
            color: "var(--db-cream)",
            letterSpacing: "-0.03em",
          }}
        >
          Everything You Need to Explore Beetle Genomics.
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "16px",
            marginTop: "2.5rem",
          }}
        >
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ y: 20, opacity: 0 }}
              animate={inView ? { y: 0, opacity: 1 } : {}}
              transition={{ delay: i * 0.06, duration: 0.5, ease: [0.22, 0.61, 0.36, 1] }}
              whileHover={{ borderColor: "rgba(0,240,255,0.3)" }}
              style={{
                background: "var(--db-charcoal)",
                border: "1px solid var(--db-line)",
                borderRadius: "12px",
                padding: "24px",
                cursor: "pointer",
              }}
            >
              <Link href={f.href} style={{ textDecoration: "none", color: "inherit" }}>
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "10px",
                    background: f.bg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.3rem",
                  }}
                >
                  {f.icon}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontWeight: 700,
                    fontSize: "15px",
                    color: "var(--db-cream)",
                    marginTop: "14px",
                  }}
                >
                  {f.title}
                </div>
                <p
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "13px",
                    color: "var(--db-muted)",
                    lineHeight: 1.6,
                    marginTop: "8px",
                  }}
                >
                  {f.description}
                </p>
                <div
                  style={{
                    color: "var(--db-cyan)",
                    fontFamily: "var(--font-sans)",
                    fontSize: "12px",
                    marginTop: "12px",
                  }}
                >
                  Open →
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
