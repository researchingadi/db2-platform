import JBrowseWrapper from "@/components/genome/JBrowseWrapper";
import PageShell from "@/components/site/PageShell";
import { DB2_ASSEMBLY, DB2_TRACKS } from "@/lib/jbrowse-config";

const META = [
  { label: "Assembly",    value: "Otau_3.2",          accent: "#22d3ee" },
  { label: "Browser",     value: "JBrowse 2",          accent: "#818cf8" },
  { label: "Tracks",      value: "2 loaded",           accent: "#10b981" },
  { label: "Data Host",   value: "Cloudflare R2",      accent: "#818cf8" },
  { label: "Chromosomes", value: "12",                 accent: "#22d3ee" },
  { label: "Gene Models", value: "28,456",             accent: "#10b981" },
];

export const metadata = {
  title: "Genome Browser — DB²",
  description: "Interactive JBrowse 2 genome browser for Onthophagus taurus Otau_3.2 assembly",
};

export default function GenomeBrowserPage() {
  return (
    <PageShell>
      <div style={{
        minHeight: "calc(100vh - 64px)",
        background: "var(--db-bg)",
        padding: "2.5rem 1.5rem 3rem",
      }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>

          {/* ── Header ── */}
          <div style={{ marginBottom: "2rem" }}>
            <p style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.7rem",
              color: "#22d3ee",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              marginBottom: "10px",
            }}>
              DB² · Genome Viewer
            </p>
            <h1 style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 700,
              fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
              color: "#e2e8f0",
              letterSpacing: "-0.03em",
              margin: "0 0 0.75rem",
            }}>
              Genome Browser
            </h1>
            <p style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.9rem",
              color: "#64748b",
              maxWidth: "52ch",
              lineHeight: 1.65,
            }}>
              Explore the <em style={{ color: "#94a3b8" }}>Onthophagus taurus</em> Otau_3.2
              assembly with NCBI and GTF annotation tracks.
            </p>
          </div>

          {/* ── Metadata strip ── */}
          <div style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
            marginBottom: "1.5rem",
          }}>
            {META.map((m) => (
              <div key={m.label} style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 14px",
                borderRadius: "8px",
                background: "rgba(9,13,26,0.8)",
                border: "1px solid rgba(26,34,64,0.7)",
              }}>
                <span style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.65rem",
                  color: "#475569",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}>
                  {m.label}
                </span>
                <span style={{
                  fontFamily: "var(--font-mono)",
                  fontWeight: 500,
                  fontSize: "0.8rem",
                  color: m.accent,
                }}>
                  {m.value}
                </span>
              </div>
            ))}
          </div>

          {/* ── Viewer container ── */}
          <div style={{
            borderRadius: "16px",
            border: "1px solid rgba(34,211,238,0.15)",
            overflow: "hidden",
            boxShadow: "0 0 40px rgba(34,211,238,0.06), 0 24px 64px rgba(0,0,0,0.5)",
            background: "rgba(9,13,26,0.6)",
          }}>
            {/* Window chrome */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 16px",
              borderBottom: "1px solid rgba(26,34,64,0.5)",
              background: "rgba(4,6,15,0.5)",
            }}>
              {["#ff5f57","#ffbd2e","#28ca42"].map((c) => (
                <div key={c} style={{ width: "11px", height: "11px", borderRadius: "50%", background: c }} />
              ))}
              <span style={{
                marginLeft: "8px",
                fontFamily: "var(--font-mono)",
                fontSize: "0.7rem",
                color: "#475569",
              }}>
                JBrowse 2 · {DB2_ASSEMBLY.name}
              </span>
            </div>

            {/* JBrowse */}
            <JBrowseWrapper assembly={DB2_ASSEMBLY} tracks={DB2_TRACKS} />
          </div>

          {/* ── Footer note ── */}
          <p style={{
            marginTop: "1rem",
            fontFamily: "var(--font-mono)",
            fontSize: "0.68rem",
            color: "#334155",
            textAlign: "right",
          }}>
            Sequence and annotation data hosted on Cloudflare R2 · JBrowse 2 v3 · DB² Davidson Lab
          </p>
        </div>
      </div>
    </PageShell>
  );
}
