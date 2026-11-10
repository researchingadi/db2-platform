"use client";

import { MotionConfig, motion, useInView } from "framer-motion";
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
        background: "var(--db-black)",
        borderTop: "var(--arcade-border) solid var(--db-cream)",
        borderBottom: "var(--arcade-border) solid var(--db-cream)",
        padding: "40px 24px 46px",
      }}
    >
      <MotionConfig reducedMotion="user">
        <div
          ref={ref}
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "20px",
            maxWidth: "1540px",
            margin: "0 auto",
          }}
        >
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className="arcade-panel"
              style={{
                flex: "1 1 180px",
                textAlign: "center",
                padding: 0,
              }}
            >
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={inView ? { y: 0, opacity: 1 } : {}}
                transition={{ delay: i * 0.08, duration: 0.5, ease: [0.22, 0.61, 0.36, 1] }}
                style={{ padding: "18px 14px 20px" }}
              >
                <div style={{ fontSize: "1.4rem", lineHeight: 1 }}>{stat.icon}</div>
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontWeight: 500,
                    fontSize: "2rem",
                    lineHeight: 1.2,
                    color: "var(--db-cream)",
                    marginTop: "10px",
                  }}
                >
                  {stat.value}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-pixel)",
                    fontSize: "0.58rem",
                    lineHeight: 1.5,
                    textTransform: "uppercase",
                    color: "var(--db-cyan)",
                    marginTop: "12px",
                  }}
                >
                  {stat.label}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontWeight: 400,
                    fontSize: "14px",
                    lineHeight: 1.45,
                    color: "var(--db-stone)",
                    marginTop: "8px",
                  }}
                >
                  {stat.sublabel}
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </MotionConfig>
    </section>
  );
}
