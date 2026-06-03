"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import Navbar from "../../components/site/Navbar";

const DistributionMap = dynamic(
  () => import("../../components/map/DistributionMap"),
  { ssr: false, loading: () => <div style={{ height: "550px", background: "#0c1028", borderRadius: "12px" }} /> }
);

interface Stats {
  observations: number | null;
  observers: number | null;
  species: number | null;
}

function formatNum(n: number | null): string {
  if (n === null) return "—";
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(0) + "k";
  return String(n);
}

const statCards = [
  { key: "observations", label: "Total Observations" },
  { key: "observers", label: "Observers" },
  { key: "species", label: "Species" },
] as const;

export default function DistributionPage() {
  const [stats, setStats] = useState<Stats>({ observations: null, observers: null, species: null });

  useEffect(() => {
    const base = "https://api.inaturalist.org/v1";
    Promise.all([
      fetch(`${base}/observations?taxon_id=125819&per_page=1`).then((r) => r.json()),
      fetch(`${base}/observations/observers?taxon_id=125819&per_page=1`).then((r) => r.json()),
      fetch(`${base}/observations/species_counts?taxon_id=125819&per_page=1`).then((r) => r.json()),
    ]).then(([obs, observers, species]) => {
      setStats({
        observations: obs.total_results ?? null,
        observers: observers.total_results ?? null,
        species: species.total_results ?? null,
      });
    }).catch(() => {});
  }, []);

  return (
    <>
      <Navbar />
      <div
        style={{
          background: "#06081a",
          minHeight: "100vh",
          padding: "24px",
          paddingTop: "calc(72px + 24px)",
          boxSizing: "border-box",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h1
            style={{
              fontFamily: "var(--font-serif, serif)",
              fontSize: "clamp(2rem, 5vw, 3.2rem)",
              fontWeight: 700,
              color: "#f4f1e8",
              margin: "0 0 8px 0",
              lineHeight: 1.1,
            }}
          >
            Global Distribution
          </h1>
          <p
            style={{
              color: "#64748b",
              fontSize: "0.95rem",
              margin: "0 0 28px 0",
              fontFamily: "var(--font-mono, monospace)",
              letterSpacing: "0.04em",
            }}
          >
            Scarabaeinae (Dung Beetles) · Community observations from iNaturalist
          </p>

          <div
            style={{
              borderRadius: "12px",
              overflow: "hidden",
              border: "1px solid rgba(99,102,241,0.2)",
              marginBottom: "28px",
            }}
          >
            <DistributionMap />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "16px",
              marginBottom: "24px",
            }}
          >
            {statCards.map(({ key, label }) => (
              <div
                key={key}
                style={{
                  background: "#0c1028",
                  border: "1px solid rgba(99,102,241,0.35)",
                  borderRadius: "10px",
                  padding: "20px 24px",
                }}
              >
                <div
                  style={{
                    fontSize: "clamp(1.8rem, 3vw, 2.4rem)",
                    fontWeight: 700,
                    color: "#f4f1e8",
                    fontFamily: "var(--font-mono, monospace)",
                    lineHeight: 1,
                    marginBottom: "6px",
                  }}
                >
                  {formatNum(stats[key])}
                </div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "#64748b",
                    fontFamily: "var(--font-mono, monospace)",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  {label}
                </div>
              </div>
            ))}
          </div>

          <p
            style={{
              color: "#475569",
              fontSize: "0.78rem",
              fontFamily: "var(--font-mono, monospace)",
              letterSpacing: "0.06em",
            }}
          >
            Observation data provided by iNaturalist ·{" "}
            <a
              href="https://www.inaturalist.org/taxa/125819-Scarabaeinae"
              target="_blank"
              rel="noreferrer"
              style={{ color: "#6366f1", textDecoration: "none" }}
            >
              View full dataset →
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
