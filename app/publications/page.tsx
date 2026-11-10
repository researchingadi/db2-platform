import AnimatedSection from "@/components/site/AnimatedSection";
import PageShell from "@/components/site/PageShell";
import ReducedMotion from "@/components/site/ReducedMotion";

export const metadata = {
  title: "Publications — DB²",
  description:
    "Genomics research and Davidson Lab publications for Onthophagus taurus",
};

/* All entries are placeholders — not real publications */
const SECTIONS = [
  {
    heading: "Genome Assembly & Annotation",
    accent: "var(--db-cyan)",
    papers: [
      {
        title:
          "Chromosome-level genome assembly of Onthophagus taurus reveals the genomic basis of horn polyphenism",
        authors: "Davidson Lab et al.",
        journal: "placeholder — not a real publication",
        year: "2024",
        tags: ["Assembly", "Annotation", "NCBI"],
      },
      {
        title:
          "Comparative genomics of dung beetles: structural variation and gene family expansion",
        authors: "Placeholder Authors",
        journal: "placeholder — not a real publication",
        year: "2024",
        tags: ["Comparative genomics", "Gene families"],
      },
    ],
  },
  {
    heading: "Davidson Lab Publications",
    accent: "var(--db-violet)",
    papers: [
      {
        title:
          "Developmental plasticity and the evolution of beetle horns",
        authors: "Davidson Lab",
        journal: "placeholder — representative topic, not a real publication",
        year: "2023",
        tags: ["Plasticity", "Morphology", "Evo-devo"],
      },
      {
        title:
          "RNA-seq analysis of horn development across nutrition-mediated alternative morphs",
        authors: "Placeholder Authors",
        journal: "placeholder — not a real publication",
        year: "2023",
        tags: ["RNA-seq", "Gene expression", "Polyphenism"],
      },
    ],
  },
  {
    heading: "Dung Beetle Biology",
    accent: "var(--db-green)",
    papers: [
      {
        title:
          "Ecology and evolution of dung beetles: a global perspective",
        authors: "Placeholder Authors",
        journal: "placeholder — representative topic",
        year: "2022",
        tags: ["Ecology", "Scarabaeidae", "Evolution"],
      },
    ],
  },
];

export default function PublicationsPage() {
  return (
    <PageShell>
      <ReducedMotion>
        {/* ── Cinematic header ── */}
        <section
          style={{
            position: "relative",
            minHeight: "280px",
            overflow: "hidden",
            borderBottom: "var(--arcade-border) solid var(--db-cream)",
          }}
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: 0.7,
            }}
          >
            <source src="/publications-bg.mp4" type="video/mp4" />
          </video>
          <div
            style={{
              position: "relative",
              zIndex: 1,
              minHeight: "280px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              padding: "2rem 1.25rem",
              maxWidth: "1540px",
              margin: "0 auto",
            }}
          >
            <AnimatedSection>
              {/* Solid panel keeps the header text readable over any video frame */}
              <div className="arcade-panel" style={{ padding: "20px 22px", maxWidth: "640px" }}>
                <p className="db-eyebrow">DB² · Literature</p>
                <h1
                  className="arcade-title"
                  style={{
                    fontSize: "clamp(1.4rem, 3.2vw, 2rem)",
                    margin: 0,
                    lineHeight: 1.3,
                  }}
                >
                  Publications
                </h1>
                <p
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "15px",
                    lineHeight: 1.6,
                    color: "var(--db-cream)",
                    marginTop: "14px",
                    marginBottom: 0,
                    maxWidth: "560px",
                  }}
                >
                  Research papers associated with the DB² platform, Davidson Lab, and
                  the broader dung beetle genomics community.
                </p>
                <span
                  className="arcade-chip"
                  style={{ marginTop: "14px", borderColor: "var(--arcade-pink)", fontFamily: "var(--font-sans)", fontWeight: 600 }}
                >
                  <span className="arcade-dot" style={{ background: "var(--arcade-pink)" }} />
                  All entries below are placeholders — not real publications
                </span>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* ── Sections ── */}
        <div style={{ maxWidth: "1540px", margin: "0 auto", padding: "4rem 1.25rem 6rem" }}>
          {SECTIONS.map((sec, si) => (
            <AnimatedSection
              key={sec.heading}
              delay={si * 0.1}
              className="arcade-panel"
              style={{ marginBottom: "3rem", padding: "0 22px 8px", borderColor: sec.accent }}
            >
              {/* Section header = title bar */}
              <div
                className="arcade-panel__bar"
                style={{
                  margin: "0 -22px 4px",
                  justifyContent: "flex-start",
                  gap: "0.75rem",
                  background: sec.accent,
                  borderBottomColor: sec.accent,
                }}
              >
                <div
                  style={{
                    width: "12px",
                    height: "12px",
                    background: "var(--db-black)",
                    flexShrink: 0,
                  }}
                />
                <h2
                  style={{
                    fontFamily: "var(--font-pixel)",
                    fontWeight: 400,
                    fontSize: "0.62rem",
                    lineHeight: 1.5,
                    color: "var(--db-black)",
                    textTransform: "uppercase",
                    margin: 0,
                  }}
                >
                  {sec.heading}
                </h2>
              </div>

              {/* Paper cards */}
              <div style={{ display: "flex", flexDirection: "column" }}>
                {sec.papers.map((p, pi) => (
                  <AnimatedSection key={p.title} delay={si * 0.1 + pi * 0.07}>
                    <div
                      style={{
                        padding: "1.25rem 0",
                        borderTop: pi === 0 ? "none" : "2px dashed var(--db-line-strong)",
                      }}
                    >
                      <h3
                        style={{
                          fontFamily: "var(--font-sans)",
                          fontWeight: 700,
                          fontSize: "17px",
                          color: "var(--db-cream)",
                          margin: "0 0 0.55rem",
                          lineHeight: 1.45,
                        }}
                      >
                        {p.title}
                      </h3>
                      <div
                        style={{
                          fontFamily: "var(--font-sans)",
                          fontSize: "15px",
                          color: "var(--db-stone)",
                          marginBottom: "0.85rem",
                          lineHeight: 1.55,
                        }}
                      >
                        {p.authors} ·{" "}
                        <em style={{ color: "var(--db-stone)", fontStyle: "italic" }}>
                          {p.journal}
                        </em>{" "}
                        · {p.year}
                      </div>
                      <div
                        style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}
                      >
                        {p.tags.map((t) => (
                          <span
                            key={t}
                            className="arcade-chip"
                            style={{
                              borderColor: sec.accent,
                              color: sec.accent,
                            }}
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </AnimatedSection>
                ))}
              </div>
            </AnimatedSection>
          ))}
        </div>
      </ReducedMotion>
    </PageShell>
  );
}
