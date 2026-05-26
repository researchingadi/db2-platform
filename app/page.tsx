"use client";

import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRef, useState } from "react";
import PageShell from "@/components/site/PageShell";

const HeroShader = dynamic(() => import("@/components/site/HeroShader"), { ssr: false });

/* ── Data ─────────────────────────────────────────────────────────────────── */
const FEATURES = [
  {
    icon: "🧬",
    title: "Genome Browser",
    description:
      "Visualize the Otau_3.2 chromosome-level assembly with NCBI annotation tracks in JBrowse 2. Navigate all 12 chromosomes and 28,456 predicted gene models with precision.",
    href: "/genome-browser",
    soon: false,
  },
  {
    icon: "🔬",
    title: "Gene Annotations",
    description:
      "Search and filter all 28,456 predicted gene models by chromosome, genomic position, and annotation source. Deep-link from browser to gene detail pages.",
    href: "/genes",
    soon: true,
  },
  {
    icon: "📊",
    title: "RNA-seq Datasets",
    description:
      "Explore transcriptomics data across developmental stages and tissues of Onthophagus taurus. Raw reads, aligned BAMs, and expression matrices.",
    href: "/resources",
    soon: false,
  },
  {
    icon: "📄",
    title: "Publications",
    description:
      "Browse genomics research, assembly references, and Davidson Lab publications related to dung beetle genomics and developmental plasticity.",
    href: "/publications",
    soon: false,
  },
  {
    icon: "👥",
    title: "People",
    description:
      "Meet the researchers and developers behind the DB² platform, Davidson Lab, and the broader Onthophagus taurus research community.",
    href: "/people",
    soon: false,
  },
  {
    icon: "⚡",
    title: "BLAST Search",
    description:
      "Align nucleotide or protein sequences against the Otau_3.2 assembly and predicted proteome with integrated genome-browser visualization.",
    href: "/blast",
    soon: true,
  },
];

const STATS = [
  { value: "12",     label: "Chromosomes"      },
  { value: "295Mb",  label: "Genome Size"       },
  { value: "28,456", label: "Gene Models"       },
  { value: "2",      label: "Annotation Tracks" },
];

/* ── Hover-expand feature row ─────────────────────────────────────────────── */
function FeatureRow({
  icon, title, description, href, soon, index,
}: {
  icon: string; title: string; description: string; href: string; soon: boolean; index: number;
}) {
  const [hovered, setHovered] = useState(false);

  const inner = (
    <div
      style={{
        padding: "1.4rem 0",
        borderBottom: "1px solid rgba(26,34,64,0.5)",
        cursor: soon ? "default" : "pointer",
      }}
    >
      {/* Main row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          {/* Index */}
          <span style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.7rem",
            color: "rgba(26,34,64,0.9)",
            letterSpacing: "0.06em",
            minWidth: "22px",
            flexShrink: 0,
          }}>
            {String(index + 1).padStart(2, "0")}
          </span>
          {/* Icon */}
          <span style={{ fontSize: "1rem", opacity: soon ? 0.35 : 1, flexShrink: 0 }}>
            {icon}
          </span>
          {/* Title */}
          <motion.span
            animate={{ color: hovered && !soon ? "#22d3ee" : "#e2e8f0" }}
            transition={{ duration: 0.18 }}
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 500,
              fontSize: "clamp(1rem, 2vw, 1.2rem)",
              letterSpacing: "-0.02em",
              opacity: soon ? 0.45 : 1,
            }}
          >
            {title}
          </motion.span>
          {/* Soon badge */}
          {soon && (
            <span style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.58rem",
              color: "#334155",
              border: "1px solid rgba(26,34,64,0.9)",
              padding: "2px 8px",
              borderRadius: "3px",
              letterSpacing: "0.14em",
              textTransform: "uppercase" as const,
              flexShrink: 0,
            }}>
              Soon
            </span>
          )}
        </div>
        {/* Arrow */}
        {!soon && (
          <motion.span
            animate={{ x: hovered ? 7 : 0, color: hovered ? "#22d3ee" : "#1e293b" }}
            transition={{ duration: 0.2 }}
            style={{ fontSize: "1.1rem", flexShrink: 0 }}
          >
            →
          </motion.span>
        )}
      </div>

      {/* Expandable description */}
      <AnimatePresence>
        {hovered && !soon && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.25, 0.4, 0.25, 1] }}
            style={{ overflow: "hidden" }}
          >
            <p style={{
              margin: "0.75rem 0 0",
              /* indent aligns with title — 22px index + 1.5rem gap + 1rem icon + 1.5rem gap */
              paddingLeft: "calc(22px + 3rem + 1rem + 0.5rem)",
              fontFamily: "var(--font-sans)",
              fontSize: "0.88rem",
              color: "#64748b",
              lineHeight: 1.75,
            }}>
              {description}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  if (soon) {
    return <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>{inner}</div>;
  }
  return (
    <Link
      href={href}
      style={{ textDecoration: "none", display: "block" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {inner}
    </Link>
  );
}

/* ── Section heading with big index number ────────────────────────────────── */
function SectionHead({
  num, eyebrow, title, eyebrowColor = "#22d3ee",
}: {
  num: string; eyebrow: string; title: React.ReactNode; eyebrowColor?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.25, 0.4, 0.25, 1] }}
      style={{ display: "flex", alignItems: "baseline", gap: "2rem", marginBottom: "4rem" }}
    >
      <span style={{
        fontFamily: "var(--font-mono)",
        fontSize: "clamp(3.5rem, 7vw, 6.5rem)",
        fontWeight: 400,
        color: "rgba(26,34,64,0.55)",
        lineHeight: 1,
        flexShrink: 0,
        userSelect: "none" as const,
      }}>
        {num}
      </span>
      <div>
        <p style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.62rem",
          color: eyebrowColor,
          letterSpacing: "0.22em",
          textTransform: "uppercase" as const,
          margin: "0 0 10px",
        }}>
          {eyebrow}
        </p>
        <h2 style={{
          fontFamily: "var(--font-sans)",
          fontWeight: 700,
          fontSize: "clamp(1.7rem, 3.5vw, 2.8rem)",
          color: "#e2e8f0",
          letterSpacing: "-0.035em",
          margin: 0,
          lineHeight: 1.1,
        }}>
          {title}
        </h2>
      </div>
    </motion.div>
  );
}

/* ── Page ─────────────────────────────────────────────────────────────────── */
export default function HomePage() {
  const browserRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: browserRef, offset: ["start end", "end start"] });
  const rotateX = useTransform(scrollYProgress, [0, 0.45], [20, 0]);
  const scale   = useTransform(scrollYProgress, [0, 0.45], [0.91, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.18], [0.4, 1]);

  return (
    <PageShell padTop={false}>

      {/* ══════════════════════════════════════════════════════ HERO */}
      <section style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        overflow: "hidden",
        padding: "80px 1.5rem 5rem",
      }}>
        {/* Three.js shader background */}
        <HeroShader />

        {/* Bottom fade */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "linear-gradient(to bottom, rgba(4,6,15,0.15) 0%, rgba(4,6,15,0.0) 35%, rgba(4,6,15,0.88) 100%)",
        }} />

        {/* Subtle grid */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.025,
          backgroundImage:
            "linear-gradient(rgba(34,211,238,1) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,1) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }} />

        {/* Hero content — editorial, bottom-anchored */}
        <div style={{ position: "relative", zIndex: 1, maxWidth: "1280px", width: "100%", margin: "0 auto" }}>

          {/* Eyebrow */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.68rem",
              color: "#22d3ee",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              marginBottom: "1.5rem",
              display: "flex",
              alignItems: "center",
              gap: "14px",
              margin: "0 0 1.5rem",
            }}
          >
            <span style={{ width: "28px", height: "1px", background: "#22d3ee", display: "inline-block", flexShrink: 0 }} />
            Onthophagus taurus · Genome Resource · Davidson Lab
          </motion.p>

          {/* Main headline — massive editorial type */}
          <motion.h1
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.9, ease: [0.25, 0.4, 0.25, 1] }}
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 700,
              fontSize: "clamp(3.2rem, 9vw, 8.5rem)",
              lineHeight: 0.94,
              letterSpacing: "-0.04em",
              color: "#e2e8f0",
              margin: "0 0 2.5rem",
            }}
          >
            The Dung Beetle<br />
            <span style={{
              background: "linear-gradient(130deg, #22d3ee 15%, #818cf8 85%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              Genome
            </span>{" "}
            Database.
          </motion.h1>

          {/* Bottom row: tagline + CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.7, ease: [0.25, 0.4, 0.25, 1] }}
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "2rem",
            }}
          >
            <p style={{
              fontFamily: "var(--font-sans)",
              fontSize: "clamp(0.875rem, 1.4vw, 1rem)",
              color: "#64748b",
              maxWidth: "44ch",
              lineHeight: 1.75,
              margin: 0,
            }}>
              A modern genomics platform integrating chromosome-level assemblies,
              NCBI annotations, and RNA-seq datasets for{" "}
              <em style={{ color: "#94a3b8", fontStyle: "italic" }}>O. taurus</em> research.
            </p>

            <div style={{ display: "flex", gap: "10px", alignItems: "center", flexShrink: 0 }}>
              <Link href="/genome-browser" style={{ textDecoration: "none" }}>
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 0 36px rgba(34,211,238,0.42)" }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    padding: "13px 30px",
                    borderRadius: "10px",
                    background: "linear-gradient(135deg, #22d3ee, #818cf8)",
                    border: "none",
                    color: "#04060f",
                    fontFamily: "var(--font-sans)",
                    fontWeight: 700,
                    fontSize: "0.88rem",
                    cursor: "pointer",
                    letterSpacing: "-0.01em",
                  }}
                >
                  Open Browser →
                </motion.button>
              </Link>
              <Link href="/downloads" style={{ textDecoration: "none" }}>
                <motion.button
                  whileHover={{ color: "#22d3ee", borderColor: "rgba(34,211,238,0.4)" }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    padding: "13px 24px",
                    borderRadius: "10px",
                    background: "transparent",
                    border: "1px solid rgba(26,34,64,0.9)",
                    color: "#64748b",
                    fontFamily: "var(--font-sans)",
                    fontWeight: 500,
                    fontSize: "0.88rem",
                    cursor: "pointer",
                    transition: "color 0.2s, border-color 0.2s",
                  }}
                >
                  Download Data
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Vertical scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2 }}
          style={{
            position: "absolute",
            right: "2rem",
            bottom: "2.5rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "10px",
            zIndex: 1,
          }}
        >
          <div style={{ width: "1px", height: "56px", overflow: "hidden", background: "rgba(26,34,64,0.6)", position: "relative" }}>
            <motion.div
              animate={{ y: ["-100%", "200%"] }}
              transition={{ duration: 1.7, repeat: Infinity, ease: "linear" }}
              style={{ width: "100%", height: "45%", background: "#22d3ee" }}
            />
          </div>
          <span style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.55rem",
            color: "#334155",
            letterSpacing: "0.18em",
            writingMode: "vertical-rl" as const,
            textTransform: "uppercase" as const,
          }}>
            Scroll
          </span>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════════ STATS */}
      <section style={{
        borderTop: "1px solid rgba(26,34,64,0.5)",
        borderBottom: "1px solid rgba(26,34,64,0.5)",
      }}>
        <div style={{
          maxWidth: "1280px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
        }}>
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              style={{
                padding: "3rem 2rem",
                textAlign: "center",
                borderRight: i < STATS.length - 1 ? "1px solid rgba(26,34,64,0.5)" : "none",
              }}
            >
              <div style={{
                fontFamily: "var(--font-mono)",
                fontSize: "clamp(1.8rem, 3.5vw, 3rem)",
                fontWeight: 400,
                color: "#22d3ee",
                lineHeight: 1,
                marginBottom: "0.6rem",
              }}>
                {s.value}
              </div>
              <div style={{
                fontFamily: "var(--font-sans)",
                fontSize: "0.7rem",
                color: "#475569",
                textTransform: "uppercase" as const,
                letterSpacing: "0.14em",
              }}>
                {s.label}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════ [01] PLATFORM */}
      <section style={{ padding: "7rem 1.5rem", maxWidth: "1280px", margin: "0 auto", width: "100%" }}>

        <SectionHead
          num="01"
          eyebrow="Platform"
          eyebrowColor="#22d3ee"
          title={<>Everything you need<br />to explore the genome.</>}
        />

        {/* Feature accordion */}
        <div style={{ borderTop: "1px solid rgba(26,34,64,0.5)" }}>
          {FEATURES.map((f, i) => (
            <FeatureRow key={f.title} {...f} index={i} />
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════ [02] ASSEMBLY */}
      <section
        ref={browserRef}
        style={{
          padding: "7rem 1.5rem",
          maxWidth: "1280px",
          margin: "0 auto",
          width: "100%",
          perspective: "1200px",
          borderTop: "1px solid rgba(26,34,64,0.4)",
        }}
      >
        <SectionHead
          num="02"
          eyebrow="Assembly"
          eyebrowColor="#818cf8"
          title={<>IU_Otau_3.0<br />Reference Assembly</>}
        />

        {/* 3D perspective card on scroll */}
        <motion.div style={{ rotateX, scale, opacity, transformStyle: "preserve-3d" }}>
          <div style={{
            borderRadius: "16px",
            background: "rgba(9,13,26,0.92)",
            border: "1px solid rgba(34,211,238,0.12)",
            boxShadow: "0 0 60px rgba(34,211,238,0.05), 0 40px 80px rgba(0,0,0,0.7)",
            overflow: "hidden",
          }}>
            {/* Window chrome */}
            <div style={{
              display: "flex", alignItems: "center", gap: "8px",
              padding: "13px 20px",
              borderBottom: "1px solid rgba(26,34,64,0.6)",
              background: "rgba(4,6,15,0.6)",
            }}>
              {["#ff5f57", "#ffbd2e", "#28ca42"].map((c) => (
                <div key={c} style={{ width: "11px", height: "11px", borderRadius: "50%", background: c }} />
              ))}
              <div style={{
                marginLeft: "10px", flex: 1,
                background: "rgba(14,20,38,0.8)",
                borderRadius: "5px", padding: "4px 12px",
                fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "#334155",
              }}>
                db2-platform.io/genome-browser — Otau_3.2
              </div>
            </div>

            {/* Metadata tiles */}
            <div style={{
              padding: "2rem",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))",
              gap: "10px",
            }}>
              {[
                { label: "Assembly Name", value: "IU_Otau_3.0",    accent: "#22d3ee" },
                { label: "Accession",     value: "GCF_036711975.1", accent: "#818cf8" },
                { label: "Chromosomes",   value: "12",              accent: "#22d3ee" },
                { label: "Genome Size",   value: "~295 Mb",         accent: "#10b981" },
                { label: "Source",        value: "NCBI RefSeq",     accent: "#818cf8" },
                { label: "Browser",       value: "JBrowse 2",       accent: "#10b981" },
              ].map((m) => (
                <div key={m.label} style={{
                  padding: "1rem 1.2rem",
                  borderRadius: "8px",
                  background: "rgba(14,20,38,0.7)",
                  border: "1px solid rgba(26,34,64,0.4)",
                }}>
                  <div style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.58rem",
                    color: "#334155",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase" as const,
                    marginBottom: "5px",
                  }}>
                    {m.label}
                  </div>
                  <div style={{
                    fontFamily: "var(--font-mono)",
                    fontWeight: 500,
                    fontSize: "0.88rem",
                    color: m.accent,
                  }}>
                    {m.value}
                  </div>
                </div>
              ))}
            </div>

            {/* CTA strip */}
            <div style={{
              padding: "1rem 2rem 1.5rem",
              borderTop: "1px solid rgba(26,34,64,0.4)",
              display: "flex", alignItems: "center", justifyContent: "space-between",
              flexWrap: "wrap", gap: "12px",
            }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "#334155" }}>
                2 annotation tracks · NCBI GFF3 · GTF
              </span>
              <Link href="/genome-browser" style={{ textDecoration: "none" }}>
                <motion.button
                  whileHover={{ scale: 1.04, boxShadow: "0 0 22px rgba(34,211,238,0.28)" }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    padding: "10px 22px",
                    borderRadius: "8px",
                    background: "rgba(34,211,238,0.07)",
                    border: "1px solid rgba(34,211,238,0.28)",
                    color: "#22d3ee",
                    fontFamily: "var(--font-sans)",
                    fontWeight: 600,
                    fontSize: "0.8rem",
                    cursor: "pointer",
                  }}
                >
                  Open in Browser →
                </motion.button>
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════════ [03] GET STARTED */}
      <section style={{
        borderTop: "1px solid rgba(26,34,64,0.4)",
        padding: "8rem 1.5rem 9rem",
        maxWidth: "1280px",
        margin: "0 auto",
        width: "100%",
      }}>
        <SectionHead
          num="03"
          eyebrow="Get Started"
          eyebrowColor="#10b981"
          title={<>Built by the Davidson Lab.<br />Open to the community.</>}
        />

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "0.95rem",
            color: "#64748b",
            lineHeight: 1.75,
            maxWidth: "50ch",
            margin: "0 0 3rem",
            paddingLeft: "calc(clamp(3.5rem, 7vw, 6.5rem) + 2rem)",
          }}
        >
          DB² is a freely available scientific resource for the dung beetle genomics
          community. New tools, data, and visualizations are added continuously.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
            paddingLeft: "calc(clamp(3.5rem, 7vw, 6.5rem) + 2rem)",
          }}
        >
          <Link href="/people" style={{ textDecoration: "none" }}>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 28px rgba(34,211,238,0.36)" }}
              whileTap={{ scale: 0.97 }}
              style={{
                padding: "14px 32px",
                borderRadius: "10px",
                background: "linear-gradient(135deg, #22d3ee, #818cf8)",
                border: "none",
                color: "#04060f",
                fontFamily: "var(--font-sans)",
                fontWeight: 700,
                fontSize: "0.9rem",
                cursor: "pointer",
              }}
            >
              Meet the Team →
            </motion.button>
          </Link>
          <Link href="/downloads" style={{ textDecoration: "none" }}>
            <motion.button
              whileHover={{ color: "#22d3ee", borderColor: "rgba(34,211,238,0.4)" }}
              whileTap={{ scale: 0.97 }}
              style={{
                padding: "14px 28px",
                borderRadius: "10px",
                background: "transparent",
                border: "1px solid rgba(26,34,64,0.9)",
                color: "#64748b",
                fontFamily: "var(--font-sans)",
                fontWeight: 500,
                fontSize: "0.9rem",
                cursor: "pointer",
                transition: "color 0.2s, border-color 0.2s",
              }}
            >
              Download Data
            </motion.button>
          </Link>
        </motion.div>
      </section>

    </PageShell>
  );
}
