"use client";

import Link from "next/link";
import { MotionConfig, motion, useInView } from "framer-motion";
import { useRef } from "react";

const SPECIES = [
  {
    scientific: "Onthophagus taurus",
    assembly: "Otau_3.2 · IU_Otau_3.0",
    size: "~295 Mb",
    accent: "var(--db-cyan)",
    description:
      "Reference species for horn polyphenism research. Chromosome-level assembly with NCBI RefSeq and Davidson Lab annotations across 12 chromosomes.",
  },
  {
    scientific: "Onthophagus sagittarius",
    assembly: "Osag_1.3",
    size: "~561 Mb",
    accent: "var(--db-green)",
    description:
      "Closely related Onthophagus species with AUGUSTUS gene annotations, plus gene and protein sequence downloads.",
  },
  {
    scientific: "Digitonthophagus gazella",
    assembly: "Dgaz_1.3",
    size: "~346 Mb",
    accent: "var(--db-cyan)",
    description:
      "The gazelle dung beetle, with a full genome assembly, repeat-masked genome, and AUGUSTUS annotations.",
  },
  {
    scientific: "Onthophagus binodis",
    assembly: "Obin_1.0",
    size: "~843 Mb",
    accent: "var(--db-green)",
    description:
      "The largest assembly in the database, including masked genome, protein, and nucleotide sequence downloads.",
  },
];

export default function SpeciesSection() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section style={{ padding: "80px 24px", background: "var(--db-black)" }}>
      <MotionConfig reducedMotion="user">
        <div style={{ maxWidth: "1200px", margin: "0 auto" }} ref={ref}>
          <p className="db-eyebrow">Species Database</p>
          <h2
            className="arcade-title"
            style={{
              fontSize: "clamp(1.25rem, 3vw, 2rem)",
              lineHeight: 1.3,
              marginTop: "14px",
            }}
          >
            Four Species. One Platform.
          </h2>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "1rem",
              color: "var(--db-stone)",
              maxWidth: "560px",
              lineHeight: 1.7,
              marginTop: "18px",
            }}
          >
            Chromosome-level genome assemblies for Onthophagus taurus and three
            related species, all accessible from a single interactive genome
            browser.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(320px, 100%), 1fr))",
              gap: "24px",
              marginTop: "2.5rem",
            }}
          >
            {SPECIES.map((s, i) => (
              <motion.div
                key={s.scientific}
                initial={{ y: 20, opacity: 0 }}
                animate={inView ? { y: 0, opacity: 1 } : {}}
                transition={{ delay: i * 0.08, duration: 0.5, ease: [0.22, 0.61, 0.36, 1] }}
                className="arcade-panel arcade-hover"
                style={{
                  padding: "0 22px 22px",
                  cursor: "pointer",
                }}
              >
                <Link href="/genome-browser" className="focus-ring" style={{ textDecoration: "none", color: "inherit", display: "block" }}>
                  {/* Title bar: the species name (kept italic in the readable font) */}
                  <div
                    className="arcade-panel__bar"
                    style={{
                      margin: "0 -22px 16px",
                      justifyContent: "flex-start",
                      gap: "0.6rem",
                    }}
                  >
                    <span
                      style={{
                        width: "10px",
                        height: "10px",
                        background: s.accent,
                        boxShadow: "2px 2px 0 var(--db-black)",
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontStyle: "italic",
                        fontWeight: 700,
                        fontSize: "15px",
                        textTransform: "none",
                        letterSpacing: 0,
                        color: "var(--db-black)",
                      }}
                    >
                      {s.scientific}
                    </span>
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "14px",
                      color: "var(--db-stone)",
                    }}
                  >
                    {s.assembly}
                  </div>
                  <span
                    style={{
                      display: "inline-block",
                      border: `2px solid ${s.accent}`,
                      color: s.accent,
                      padding: "2px 8px",
                      fontFamily: "var(--font-mono)",
                      fontSize: "14px",
                      marginTop: "12px",
                    }}
                  >
                    {s.size}
                  </span>
                  <p
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "15px",
                      color: "var(--db-stone)",
                      lineHeight: 1.6,
                      marginTop: "14px",
                    }}
                  >
                    {s.description}
                  </p>
                  <div
                    className="pixel-glyphs"
                    style={{
                      color: "var(--db-cyan)",
                      fontSize: "0.58rem",
                      lineHeight: 1.5,
                      textTransform: "uppercase",
                      marginTop: "16px",
                    }}
                  >
                    View in Genome Browser →
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
