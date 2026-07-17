"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const SPECIES = [
  {
    scientific: "Onthophagus taurus",
    assembly: "Otau_3.2 · IU_Otau_3.0",
    size: "~295 Mb",
    accent: "#00f0ff",
    accentRgb: "0,240,255",
    description:
      "Reference species for horn polyphenism research. Chromosome-level assembly with NCBI RefSeq and Davidson Lab annotations across 12 chromosomes.",
  },
  {
    scientific: "Onthophagus sagittarius",
    assembly: "Osag_1.3",
    size: "~561 Mb",
    accent: "#8d7cff",
    accentRgb: "141,124,255",
    description:
      "Closely related Onthophagus species with AUGUSTUS gene annotations, plus gene and protein sequence downloads.",
  },
  {
    scientific: "Digitonthophagus gazella",
    assembly: "Dgaz_1.3",
    size: "~346 Mb",
    accent: "#49ffb6",
    accentRgb: "73,255,182",
    description:
      "The gazelle dung beetle, with a full genome assembly, repeat-masked genome, and AUGUSTUS annotations.",
  },
  {
    scientific: "Onthophagus binodis",
    assembly: "Obin_1.0",
    size: "~843 Mb",
    accent: "#f59e0b",
    accentRgb: "245,158,11",
    description:
      "The largest assembly in the database, including masked genome, protein, and nucleotide sequence downloads.",
  },
];

export default function SpeciesSection() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section style={{ padding: "72px 24px", background: "var(--db-black)" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }} ref={ref}>
        <p className="db-eyebrow">Species Database</p>
        <h2
          style={{
            fontFamily: "var(--font-sans)",
            fontWeight: 700,
            fontSize: "clamp(2rem, 4vw, 3rem)",
            color: "var(--db-cream)",
            marginTop: "10px",
            letterSpacing: "-0.03em",
          }}
        >
          Four Species. One Platform.
        </h2>
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "1rem",
            color: "var(--db-stone)",
            maxWidth: "520px",
            lineHeight: 1.7,
            marginTop: "12px",
          }}
        >
          Chromosome-level genome assemblies for Onthophagus taurus and three
          related species, all accessible from a single interactive genome
          browser.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "0.9rem",
            marginTop: "2.5rem",
          }}
        >
          {SPECIES.map((s, i) => (
            <motion.div
              key={s.scientific}
              initial={{ y: 20, opacity: 0 }}
              animate={inView ? { y: 0, opacity: 1 } : {}}
              transition={{ delay: i * 0.08, duration: 0.5, ease: [0.22, 0.61, 0.36, 1] }}
              whileHover={{ y: -3, borderColor: `rgba(${s.accentRgb},0.35)` }}
              style={{
                background: "var(--db-charcoal)",
                border: "1px solid var(--db-line)",
                borderRadius: "14px",
                padding: "24px",
                cursor: "pointer",
              }}
            >
              <Link href="/genome-browser" style={{ textDecoration: "none", color: "inherit" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                  <span
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "999px",
                      background: s.accent,
                      boxShadow: `0 0 12px rgba(${s.accentRgb},0.7)`,
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontStyle: "italic",
                      fontWeight: 700,
                      fontSize: "15px",
                      color: "var(--db-cream)",
                    }}
                  >
                    {s.scientific}
                  </span>
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "11px",
                    color: "var(--db-muted)",
                    marginTop: "4px",
                  }}
                >
                  {s.assembly}
                </div>
                <span
                  style={{
                    display: "inline-block",
                    background: `rgba(${s.accentRgb},0.1)`,
                    color: s.accent,
                    borderRadius: "4px",
                    padding: "2px 8px",
                    fontFamily: "var(--font-mono)",
                    fontSize: "11px",
                    marginTop: "10px",
                  }}
                >
                  {s.size}
                </span>
                <p
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "12.5px",
                    color: "var(--db-muted)",
                    lineHeight: 1.6,
                    marginTop: "10px",
                  }}
                >
                  {s.description}
                </p>
                <div
                  style={{
                    color: "var(--db-violet)",
                    fontFamily: "var(--font-sans)",
                    fontSize: "12px",
                    marginTop: "14px",
                  }}
                >
                  View in Genome Browser →
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
