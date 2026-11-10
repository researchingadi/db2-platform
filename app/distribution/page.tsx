"use client";

import dynamic from "next/dynamic";
import Navbar from "../../components/site/Navbar";

// The placeholder uses the same frame class as the map, so nothing jumps when Leaflet loads.
const DistributionMap = dynamic(
  () => import("../../components/map/DistributionMap"),
  { ssr: false, loading: () => <div className="distribution-map-frame" style={{ background: "var(--db-charcoal)" }} /> }
);

const subtitleStyle: React.CSSProperties = {
  color: "var(--db-stone)",
  fontSize: "0.95rem",
  lineHeight: 1.5,
  margin: 0,
  fontFamily: "var(--font-mono, monospace)",
  letterSpacing: "0.04em",
};

export default function DistributionPage() {
  return (
    <>
      <Navbar />
      <div
        style={{
          background: "var(--db-black)",
          minHeight: "100vh",
          padding: "16px 24px",
          paddingTop: "calc(var(--nav-height) + 16px)",
          boxSizing: "border-box",
        }}
      >
        <div style={{ maxWidth: "1600px", margin: "0 auto" }}>
          <h1
            className="arcade-title"
            style={{
              fontSize: "clamp(1rem, 4vw, 2rem)",
              margin: "0 0 6px 0",
              whiteSpace: "nowrap",
            }}
          >
            Global Distribution
          </h1>
          <p style={subtitleStyle}>
            Scarabaeinae (Dung Beetles) · Community observations from iNaturalist
          </p>
          <p style={{ ...subtitleStyle, marginBottom: "12px" }}>
            Zoom in to see individual observations, then click a point for details.
          </p>

          <div
            style={{
              overflow: "hidden",
              border: "var(--arcade-border) solid var(--db-cream)",
              boxShadow: "var(--arcade-shadow)",
              marginBottom: "12px",
            }}
          >
            <DistributionMap />
          </div>

          <p
            style={{
              color: "var(--db-stone)",
              fontSize: "14px",
              lineHeight: 1.6,
              margin: 0,
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
