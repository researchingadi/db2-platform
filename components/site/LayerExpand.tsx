"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

const LAYERS = [
  {
    num: "01",
    title: "Chromosome-level assembly",
    detail:
      "Otau_3.2 reference files hosted on Cloudflare R2 for browser access and direct download. bgzip-compressed FASTA with FAI/GZI indices. NCBI accession GCF_036711975.1. 12 chromosomes, ~295 Mb.",
    metric: "295 Mb · 12 chr",
    accent: "var(--db-cyan)",
    accentRgb: "0,240,255",
    href: "/downloads",
    cta: "Download assembly",
  },
  {
    num: "02",
    title: "Annotation tracks",
    detail:
      "NCBI and custom lab annotations maintained as separable scientific layers. GFF3 and GTF formats with tabix indexing for JBrowse 2 integration. 28,456 predicted gene models across 12 chromosomes.",
    metric: "28,456 genes",
    accent: "var(--db-violet)",
    accentRgb: "141,124,255",
    href: "/downloads",
    cta: "Download annotations",
  },
  {
    num: "03",
    title: "Transcriptomics",
    detail:
      "RNA-seq resources will connect gene expression to biological features including horn development, nutrition-mediated polyphenism, and developmental stage comparisons. Expression data organized around functional biology.",
    metric: "Planned · RNA-seq",
    accent: "var(--db-green)",
    accentRgb: "73,255,182",
    href: "/resources",
    cta: "View roadmap",
  },
  {
    num: "04",
    title: "Future comparative tools",
    detail:
      "BLAST and comparative genomics infrastructure will be added without requiring a platform redesign. The DB² architecture is built around extensible scientific layers — new tools slot in as the research scales.",
    metric: "Roadmap",
    accent: "var(--db-stone)",
    accentRgb: "184,178,164",
    href: "/resources",
    cta: "Explore resources",
  },
];

export default function LayerExpand() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div
      style={{
        borderTop: "1px solid var(--db-line)",
      }}
    >
      {LAYERS.map((layer, i) => (
        <motion.div
          key={layer.num}
          onHoverStart={() => setHovered(i)}
          onHoverEnd={() => setHovered(null)}
          style={{
            borderBottom: "1px solid var(--db-line)",
            overflow: "hidden",
          }}
        >
          {/* Row header */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "72px 1fr auto",
              gap: "1.5rem",
              alignItems: "center",
              padding: "1.6rem 0",
              cursor: "default",
            }}
          >
            <motion.span
              animate={{
                color: hovered === i ? layer.accent : "var(--db-muted)",
              }}
              transition={{ duration: 0.25 }}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.72rem",
                letterSpacing: "0.16em",
                display: "block",
              }}
            >
              {layer.num}
            </motion.span>

            <motion.h3
              animate={{
                x: hovered === i ? 6 : 0,
              }}
              transition={{ duration: 0.3, ease: [0.22, 0.61, 0.36, 1] }}
              style={{
                margin: 0,
                fontSize: "clamp(1.15rem, 2.2vw, 2rem)",
                letterSpacing: "-0.04em",
                color: "var(--db-cream)",
                lineHeight: 1,
                fontWeight: 500,
              }}
            >
              {layer.title}
            </motion.h3>

            <div
              className="db-pill"
              style={{
                whiteSpace: "nowrap",
                transition: "opacity 0.25s",
                opacity: hovered === i ? 0 : 1,
              }}
            >
              {layer.metric}
            </div>
          </div>

          {/* Expandable detail panel */}
          <AnimatePresence initial={false}>
            {hovered === i && (
              <motion.div
                key="expand"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.38, ease: [0.22, 0.61, 0.36, 1] }}
                style={{ overflow: "hidden" }}
              >
                <div
                  style={{
                    paddingLeft: "72px",
                    paddingBottom: "1.8rem",
                    paddingRight: "1rem",
                    display: "grid",
                    gridTemplateColumns: "1fr auto",
                    gap: "1.5rem",
                    alignItems: "end",
                  }}
                >
                  <div>
                    {/* Accent rule */}
                    <div
                      style={{
                        height: "1px",
                        background: `linear-gradient(90deg, rgba(${layer.accentRgb}, 0.55), transparent)`,
                        marginBottom: "1rem",
                      }}
                    />
                    <p
                      style={{
                        margin: 0,
                        color: "var(--db-stone)",
                        lineHeight: 1.78,
                        fontSize: "0.92rem",
                        maxWidth: "72ch",
                      }}
                    >
                      {layer.detail}
                    </p>
                  </div>

                  <Link
                    href={layer.href}
                    className="db-magnetic-link"
                    style={{
                      color: layer.accent,
                      whiteSpace: "nowrap",
                      fontSize: "0.7rem",
                    }}
                  >
                    {layer.cta}
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
}
