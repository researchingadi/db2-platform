"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import Navbar from "../../components/site/Navbar";

const DistributionMap = dynamic(
  () => import("../../components/map/DistributionMap"),
  { ssr: false, loading: () => <div style={{ height: "550px", background: "var(--db-charcoal)" }} /> }
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
          background: "var(--db-black)",
          minHeight: "100vh",
          padding: "24px",
          paddingTop: "calc(var(--nav-height) + 24px)",
          boxSizing: "border-box",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h1
            className="arcade-title"
            style={{
              fontSize: "clamp(1rem, 4vw, 2rem)",
              margin: "0 0 8px 0",
              /* Same line box as the old 1.1 × clamp(2rem, 5vw, 3.2rem) heading, so the map below
                 keeps its exact position (minus half a 1/64px layout unit to match the old rounding). */
              lineHeight: "calc(1.1 * clamp(2rem, 5vw, 3.2rem) - 0.0078px)",
              whiteSpace: "nowrap",
            }}
          >
            Global Distribution
          </h1>
          <p
            style={{
              color: "var(--db-stone)",
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
              overflow: "hidden",
              border: "var(--arcade-border) solid var(--db-cream)",
              boxShadow: "var(--arcade-shadow)",
              margin: "-3px -3px 28px",
            }}
          >
            <DistributionMap />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 200px), 1fr))",
              gap: "20px",
              marginBottom: "24px",
            }}
          >
            {statCards.map(({ key, label }) => (
              <div
                key={key}
                className="arcade-panel"
                style={{
                  padding: "0 20px 20px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div
                  style={{
                    order: 1,
                    fontSize: "clamp(1.8rem, 3vw, 2.4rem)",
                    fontWeight: 700,
                    color: "var(--db-cyan)",
                    fontFamily: "var(--font-mono)",
                    lineHeight: 1,
                  }}
                >
                  {formatNum(stats[key])}
                </div>
                <div
                  className="arcade-panel__bar"
                  style={{
                    order: 0,
                    margin: "0 -20px 18px",
                    justifyContent: "flex-start",
                  }}
                >
                  {label}
                </div>
              </div>
            ))}
          </div>

          <p
            style={{
              color: "var(--db-stone)",
              fontSize: "14px",
              lineHeight: 1.6,
              fontFamily: "var(--font-sans)",
            }}
          >
            Observation data provided by iNaturalist ·{" "}
            <a
              href="https://www.inaturalist.org/taxa/125819-Scarabaeinae"
              target="_blank"
              rel="noreferrer"
              className="focus-ring"
              style={{ color: "var(--db-cyan)", textDecoration: "underline", textUnderlineOffset: "3px", fontWeight: 600 }}
            >
              View full dataset →
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
