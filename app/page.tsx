"use client";

import Link from "next/link";
import PageShell from "@/components/site/PageShell";
import CinematicHero from "@/components/site/CinematicHero";

const modules = [
  {
    title: "Genome Browser",
    label: "Live",
    copy: "JBrowse 2 interface embedded as a stable browser console for exploring the Otau_3.2 assembly.",
    href: "/genome-browser",
  },
  {
    title: "Annotations",
    label: "GFF3 / GTF",
    copy: "NCBI and custom annotation layers structured for genes, transcripts, and feature-level discovery.",
    href: "/resources",
  },
  {
    title: "RNA-seq",
    label: "Planned",
    copy: "Expression data organized around biological features including horns, legs, and development.",
    href: "/resources",
  },
  {
    title: "Publications",
    label: "Directory",
    copy: "A research-facing publication layer connecting DB² data to the surrounding biology literature.",
    href: "/publications",
  },
];

const layers = [
  ["01", "Chromosome-level assembly", "Otau_3.2 reference files hosted for browser access and download."],
  ["02", "Annotation tracks", "NCBI and custom lab annotations kept as separable scientific layers."],
  ["03", "Transcriptomics", "RNA-seq resources will connect gene expression to biological features."],
  ["04", "Future comparative tools", "BLAST and comparative genomics can be added without redesigning the platform."],
];

export default function HomePage() {
  return (
    <PageShell padTop={false}>
      <CinematicHero />

      <section
        style={{
          padding: "7rem 1.25rem",
          borderTop: "1px solid rgba(244,241,232,0.12)",
          borderBottom: "1px solid rgba(244,241,232,0.12)",
        }}
      >
        <div style={{ maxWidth: "1540px", margin: "0 auto" }}>
          <p className="db-eyebrow">Project identity</p>
          <h2 className="db-section-title">
            A genome database with the rhythm of a digital studio.
          </h2>
          <p className="db-section-copy" style={{ marginTop: "1.6rem" }}>
            DB² is being built as a scientific data platform, but the interface
            should not feel like a static repository. The goal is to make dung
            beetle genome data feel explorable, spatial, and alive while keeping
            the underlying resources credible and useful.
          </p>
        </div>
      </section>

      <section style={{ padding: "7rem 1.25rem" }}>
        <div style={{ maxWidth: "1540px", margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "2rem",
              alignItems: "end",
              marginBottom: "2rem",
              flexWrap: "wrap",
            }}
          >
            <div>
              <p className="db-eyebrow">Platform modules</p>
              <h2 className="db-section-title" style={{ fontSize: "clamp(2.6rem, 5vw, 5.8rem)" }}>
                Built as layers,
                <br />
                not pages.
              </h2>
            </div>
            <Link href="/resources" className="db-magnetic-link">
              Explore resources
            </Link>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
              gap: "0.9rem",
            }}
            className="module-grid"
          >
            {modules.map((item) => (
              <Link key={item.title} href={item.href} style={{ textDecoration: "none" }}>
                <article
                  className="db-glass db-noise-card"
                  style={{
                    minHeight: "360px",
                    borderRadius: "26px",
                    padding: "1.35rem",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: "1rem",
                        alignItems: "center",
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.64rem",
                        color: "var(--db-muted)",
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                      }}
                    >
                      <span>{item.label}</span>
                      <span>↗</span>
                    </div>

                    <h3
                      style={{
                        margin: "4.5rem 0 1rem",
                        fontSize: "clamp(1.55rem, 2.2vw, 2.4rem)",
                        letterSpacing: "-0.055em",
                        lineHeight: 0.95,
                        color: "var(--db-cream)",
                      }}
                    >
                      {item.title}
                    </h3>

                    <p
                      style={{
                        margin: 0,
                        color: "var(--db-stone)",
                        lineHeight: 1.75,
                        fontSize: "0.92rem",
                      }}
                    >
                      {item.copy}
                    </p>
                  </div>

                  <div className="db-track-line" />
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section
        style={{
          padding: "8rem 1.25rem",
          borderTop: "1px solid rgba(244,241,232,0.12)",
          borderBottom: "1px solid rgba(244,241,232,0.12)",
          background:
            "radial-gradient(circle at 80% 20%, rgba(0,240,255,0.08), transparent 32%), var(--db-black)",
        }}
      >
        <div style={{ maxWidth: "1540px", margin: "0 auto" }}>
          <p className="db-eyebrow">Genome console</p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "0.75fr 1.25fr",
              gap: "2rem",
              alignItems: "center",
            }}
            className="browser-preview-grid"
          >
            <div>
              <h2 className="db-section-title" style={{ fontSize: "clamp(2.7rem, 5.5vw, 6.5rem)" }}>
                The browser stays stable.
                <br />
                The interface becomes cinematic.
              </h2>
              <p className="db-section-copy" style={{ marginTop: "1.4rem" }}>
                The working JBrowse instance remains isolated in an iframe, so the
                scientific browser is stable while the surrounding DB² platform can
                evolve into a premium experience.
              </p>
              <div style={{ marginTop: "2rem" }}>
                <Link href="/genome-browser" className="db-magnetic-link">
                  Open browser
                </Link>
              </div>
            </div>

            <div
              className="db-glass"
              style={{
                borderRadius: "30px",
                overflow: "hidden",
                minHeight: "520px",
                position: "relative",
              }}
            >
              <div className="db-grid" style={{ position: "absolute", inset: 0, opacity: 0.28 }} />
              <div className="db-grain" style={{ position: "absolute", inset: 0 }} />

              <div style={{ position: "relative", padding: "1rem", height: "100%" }}>
                <div
                  style={{
                    height: "48px",
                    borderBottom: "1px solid rgba(244,241,232,0.12)",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.45rem",
                    fontFamily: "var(--font-mono)",
                    color: "var(--db-muted)",
                    fontSize: "0.68rem",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  <span className="db-dot" />
                  JBrowse 2 · Otau_3.2 · Active
                </div>

                <div style={{ padding: "2rem 0", display: "grid", gap: "0.8rem" }}>
                  {Array.from({ length: 15 }).map((_, i) => (
                    <div
                      key={i}
                      className="db-track-line"
                      style={{
                        width: `${45 + ((i * 17) % 50)}%`,
                        opacity: 0.2 + (i % 5) * 0.13,
                        marginLeft: `${(i * 7) % 22}%`,
                      }}
                    />
                  ))}
                </div>

                <div
                  style={{
                    position: "absolute",
                    left: "1rem",
                    right: "1rem",
                    bottom: "1rem",
                    borderTop: "1px solid rgba(244,241,232,0.12)",
                    paddingTop: "1rem",
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "0.75rem",
                  }}
                >
                  {["12 chromosomes", "28,456 genes", "Cloudflare R2"].map((x) => (
                    <div key={x} className="db-pill" style={{ justifyContent: "center" }}>
                      {x}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: "8rem 1.25rem" }}>
        <div style={{ maxWidth: "1540px", margin: "0 auto" }}>
          <p className="db-eyebrow">Scientific layers</p>
          <h2 className="db-section-title" style={{ marginBottom: "2rem" }}>
            Data infrastructure,
            <br />
            organized for discovery.
          </h2>

          <div style={{ display: "grid", gap: "0.85rem" }}>
            {layers.map(([num, title, copy]) => (
              <div
                key={num}
                className="db-glass"
                style={{
                  borderRadius: "24px",
                  padding: "1.5rem",
                  display: "grid",
                  gridTemplateColumns: "80px 0.8fr 1.2fr",
                  gap: "1.5rem",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    color: "var(--db-cyan)",
                    fontSize: "0.76rem",
                    letterSpacing: "0.16em",
                  }}
                >
                  {num}
                </span>
                <h3
                  style={{
                    margin: 0,
                    color: "var(--db-cream)",
                    fontSize: "clamp(1.3rem, 2.4vw, 2.2rem)",
                    letterSpacing: "-0.045em",
                  }}
                >
                  {title}
                </h3>
                <p style={{ margin: 0, color: "var(--db-stone)", lineHeight: 1.7 }}>
                  {copy}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        style={{
          padding: "8rem 1.25rem 9rem",
          borderTop: "1px solid rgba(244,241,232,0.12)",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "980px", margin: "0 auto" }}>
          <p className="db-eyebrow">Open research interface</p>
          <h2 className="db-section-title">
            Built for the dung beetle genomics community.
          </h2>
          <p className="db-section-copy" style={{ margin: "1.5rem auto 2rem" }}>
            DB² is early, but the goal is clear: a visually compelling,
            scientifically credible platform for genome browsing, transcriptomic
            resources, publications, and future comparative tools.
          </p>
          <Link href="/genome-browser" className="db-magnetic-link">
            Enter DB²
          </Link>
        </div>
      </section>
    </PageShell>
  );
}