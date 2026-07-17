"use client";

import { useState } from "react";
import JBrowseWrapper from "@/components/genome/JBrowseWrapper";
import PageShell from "@/components/site/PageShell";
import { SPECIES_LIST, SPECIES_CONFIGS } from "@/lib/jbrowse-config";

export default function GenomeBrowserPage() {
  const [selectedSpecies, setSelectedSpecies] = useState("otaurus");

  const species = SPECIES_LIST.find((s) => s.id === selectedSpecies)!;
  const config = SPECIES_CONFIGS[selectedSpecies];

  return (
    <PageShell>
      <div
        style={{
          minHeight: "calc(100vh - 72px)",
          background: "var(--db-black)",
          padding: "2.5rem 1.5rem 3rem",
          position: "relative",
        }}
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            objectFit: "cover",
            opacity: 0.6,
            zIndex: 0,
            pointerEvents: "none",
          }}
        >
          <source src="/genome-bg.mp4" type="video/mp4" />
        </video>

        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "linear-gradient(to bottom, rgba(3,3,3,0.75), rgba(3,3,3,0.85))",
            zIndex: 0,
            pointerEvents: "none",
          }}
        />

        <div style={{ position: "relative", zIndex: 1, maxWidth: "1280px", margin: "0 auto" }}>

          {/* ── Header ── */}
          <div style={{ marginBottom: "1.75rem" }}>
            <p className="db-eyebrow">DB² · Genome Viewer</p>
            <h1
              style={{
                fontFamily: "var(--font-sans)",
                fontWeight: 700,
                fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
                color: "var(--db-cream)",
                letterSpacing: "-0.03em",
                margin: "0 0 0.6rem",
              }}
            >
              Genome Browser
            </h1>
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "0.9rem",
                color: "var(--db-muted)",
                maxWidth: "52ch",
                lineHeight: 1.65,
                margin: 0,
              }}
            >
              Interactive JBrowse 2 genome viewer for comparative dung beetle genomics.
            </p>
          </div>

          {/* ── Viewer container ── */}
          <div
            style={{
              borderRadius: "16px",
              border: "1px solid rgba(0,240,255,0.14)",
              overflow: "hidden",
              boxShadow: "0 0 40px rgba(0,240,255,0.05), 0 24px 64px rgba(0,0,0,0.5)",
              background: "rgba(8,8,8,0.8)",
            }}
          >
            {/* Window chrome */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "12px 16px",
                borderBottom: "1px solid rgba(244,241,232,0.08)",
                background: "rgba(3,3,3,0.5)",
              }}
            >
              {["#ff5f57", "#ffbd2e", "#28ca42"].map((c) => (
                <div
                  key={c}
                  style={{ width: "11px", height: "11px", borderRadius: "50%", background: c }}
                />
              ))}
              <span
                style={{
                  marginLeft: "8px",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.7rem",
                  color: "var(--db-muted)",
                }}
              >
                JBrowse 2 · {species.assemblyName}
              </span>
            </div>

            {/* ── Species selector ── */}
            <div
              style={{
                background: "#0c1028",
                borderBottom: "1px solid rgba(99,102,241,0.12)",
                padding: "14px 24px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                flexWrap: "wrap",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "13px",
                  color: "#64748b",
                  flexShrink: 0,
                }}
              >
                Species:
              </span>
              {SPECIES_LIST.map((s) => {
                const active = s.id === selectedSpecies;
                return (
                  <button
                    key={s.id}
                    onClick={() => setSelectedSpecies(s.id)}
                    style={{
                      padding: "6px 14px",
                      borderRadius: "999px",
                      border: active ? "none" : "1px solid rgba(99,102,241,0.2)",
                      background: active ? "#6366f1" : "rgba(99,102,241,0.08)",
                      color: active ? "#ffffff" : "#94a3b8",
                      fontFamily: "var(--font-sans)",
                      fontSize: "13px",
                      fontStyle: "italic",
                      cursor: "pointer",
                      transition: "background 0.15s, color 0.15s",
                      lineHeight: 1.4,
                    }}
                  >
                    {s.scientificName}
                  </button>
                );
              })}
            </div>

            {/* ── Species info bar ── */}
            <div
              style={{
                background: "rgba(8,8,8,0.6)",
                borderBottom: "1px solid rgba(244,241,232,0.06)",
                padding: "8px 24px",
                display: "flex",
                alignItems: "center",
                gap: "20px",
                flexWrap: "wrap",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-sans)",
                  fontStyle: "italic",
                  fontSize: "12px",
                  color: "var(--db-stone)",
                }}
              >
                {species.scientificName}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "11px",
                  color: "var(--db-muted)",
                  letterSpacing: "0.06em",
                }}
              >
                {species.assemblyName}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "11px",
                  color: "var(--db-muted)",
                  letterSpacing: "0.06em",
                }}
              >
                {species.genomeSize}
              </span>
              {species.chromosomes && (
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "11px",
                    color: "var(--db-muted)",
                    letterSpacing: "0.06em",
                  }}
                >
                  {species.chromosomes} chromosomes
                </span>
              )}
            </div>

            {/* ── JBrowse ── */}
            <JBrowseWrapper
              key={selectedSpecies}
              assembly={config.assembly}
              tracks={config.tracks}
              speciesKey={selectedSpecies}
            />
          </div>

          {/* ── Footer note ── */}
          <p
            style={{
              marginTop: "1rem",
              fontFamily: "var(--font-mono)",
              fontSize: "0.68rem",
              color: "var(--db-muted)",
              opacity: 0.55,
              textAlign: "right",
            }}
          >
            Sequence and annotation data hosted on Cloudflare R2 · JBrowse 2 · DB² Davidson Lab
          </p>
        </div>
      </div>
    </PageShell>
  );
}
