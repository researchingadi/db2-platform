"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type Stat = {
  icon: string;
  value: string;
  label: string;
  sublabel: string;
};

export default function StatsBar() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [obsCount, setObsCount] = useState<string | null>(null);
  const [pubCount, setPubCount] = useState<string | null>(null);

  useEffect(() => {
    fetch("https://api.inaturalist.org/v1/observations?taxon_id=125819&per_page=1")
      .then((r) => r.json())
      .then((d) => {
        if (typeof d.total_results === "number") {
          setObsCount(`${Math.floor(d.total_results / 1000)}k+`);
        }
      })
      .catch(() => {});

    fetch("/api/literature?query=" + encodeURIComponent("Onthophagus"))
      .then((r) => r.json())
      .then((d) => {
        if (typeof d.hitCount === "number") {
          setPubCount(`${d.hitCount.toLocaleString()}+`);
        }
      })
      .catch(() => {});
  }, []);

  const stats: Stat[] = [
    { icon: "🪲", value: "4", label: "Species", sublabel: "Onthophagus & Digitonthophagus" },
    { icon: "🧫", value: "12", label: "Chromosomes", sublabel: "O. taurus reference" },
    { icon: "🧬", value: "28,456", label: "Gene Models", sublabel: "High confidence" },
    { icon: "🌍", value: obsCount ?? "…", label: "Global Observations", sublabel: "iNaturalist · live" },
    { icon: "📚", value: pubCount ?? "…", label: "Publications", sublabel: "Europe PMC · live" },
  ];

  return (
    <section
      style={{
        background: "var(--db-charcoal)",
        borderTop: "1px solid var(--db-line)",
        borderBottom: "1px solid var(--db-line)",
        padding: "28px 24px",
      }}
    >
      <div
        ref={ref}
        style={{
          display: "flex",
          flexWrap: "wrap",
          maxWidth: "1540px",
          margin: "0 auto",
        }}
      >
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            style={{
              flex: "1 1 160px",
              textAlign: "center",
              padding: "0.5rem 1rem",
              borderLeft: i === 0 ? "none" : "1px solid var(--db-line)",
            }}
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={inView ? { y: 0, opacity: 1 } : {}}
              transition={{ delay: i * 0.08, duration: 0.5, ease: [0.22, 0.61, 0.36, 1] }}
            >
              <div style={{ fontSize: "1.3rem" }}>{stat.icon}</div>
              <div
                style={{
                  fontFamily: "var(--font-sans)",
                  fontWeight: 700,
                  fontSize: "2.2rem",
                  color: "var(--db-cream)",
                  marginTop: "0.25rem",
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-sans)",
                  fontWeight: 600,
                  fontSize: "0.75rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "var(--db-stone)",
                  marginTop: "4px",
                }}
              >
                {stat.label}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-sans)",
                  fontWeight: 400,
                  fontSize: "0.7rem",
                  color: "var(--db-muted)",
                  marginTop: "2px",
                }}
              >
                {stat.sublabel}
              </div>
            </motion.div>
          </div>
        ))}
      </div>
    </section>
  );
}
