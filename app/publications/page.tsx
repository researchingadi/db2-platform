import AnimatedSection from "@/components/site/AnimatedSection";
import PageShell from "@/components/site/PageShell";

export const metadata = {
  title: "Publications — DB²",
  description:
    "Genomics research and Davidson Lab publications for Onthophagus taurus",
};

/* All entries are placeholders — not real publications */
const SECTIONS = [
  {
    heading: "Genome Assembly & Annotation",
    accent: "#00f0ff",
    accentRgb: "0,240,255",
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
    accent: "#8d7cff",
    accentRgb: "141,124,255",
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
    accent: "#49ffb6",
    accentRgb: "73,255,182",
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
      {/* ── Cinematic header ── */}
      <section
        style={{
          position: "relative",
          height: "280px",
          overflow: "hidden",
          borderBottom: "1px solid rgba(0,240,255,0.12)",
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
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to bottom, rgba(3,3,3,0.3), rgba(3,3,3,0.92))",
          }}
        />
        <div
          style={{
            position: "relative",
            zIndex: 1,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            padding: "0 1.25rem 2rem",
            maxWidth: "1540px",
            margin: "0 auto",
          }}
        >
          <AnimatedSection>
            <p className="db-eyebrow">DB² · Literature</p>
            <h1
              style={{
                fontFamily: "var(--font-sans)",
                fontWeight: 700,
                fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
                color: "var(--db-cream)",
                letterSpacing: "-0.03em",
                margin: 0,
                lineHeight: 1.1,
              }}
            >
              Publications
            </h1>
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "14px",
                color: "var(--db-stone)",
                marginTop: "10px",
                maxWidth: "520px",
              }}
            >
              Research papers associated with the DB² platform, Davidson Lab, and
              the broader dung beetle genomics community.
            </p>
            <span
              className="db-pill"
              style={{ marginTop: "12px" }}
            >
              <span className="db-dot" />
              All entries below are placeholders — not real publications
            </span>
          </AnimatedSection>
        </div>
      </section>

      {/* ── Sections ── */}
      <div style={{ maxWidth: "1540px", margin: "0 auto", padding: "4rem 1.25rem 6rem" }}>
        {SECTIONS.map((sec, si) => (
          <AnimatedSection
            key={sec.heading}
            delay={si * 0.1}
            style={{ marginBottom: "3.5rem" }}
          >
            {/* Section header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                marginBottom: "1.25rem",
              }}
            >
              <div
                style={{
                  width: "3px",
                  height: "22px",
                  borderRadius: "2px",
                  background: sec.accent,
                  boxShadow: `0 0 12px rgba(${sec.accentRgb}, 0.65)`,
                }}
              />
              <h2
                style={{
                  fontFamily: "var(--font-mono)",
                  fontWeight: 500,
                  fontSize: "0.68rem",
                  color: "var(--db-muted)",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  margin: 0,
                }}
              >
                {sec.heading}
              </h2>
            </div>

            {/* Paper cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {sec.papers.map((p, pi) => (
                <AnimatedSection key={p.title} delay={si * 0.1 + pi * 0.07}>
                  <div
                    className="db-glass"
                    style={{
                      padding: "1.5rem",
                      borderRadius: "18px",
                      borderLeft: `3px solid rgba(${sec.accentRgb}, 0.45)`,
                    }}
                  >
                    <h3
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontWeight: 600,
                        fontSize: "0.98rem",
                        color: "var(--db-cream)",
                        margin: "0 0 0.55rem",
                        lineHeight: 1.5,
                        letterSpacing: "-0.02em",
                      }}
                    >
                      {p.title}
                    </h3>
                    <div
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: "0.82rem",
                        color: "var(--db-muted)",
                        marginBottom: "0.75rem",
                        lineHeight: 1.5,
                      }}
                    >
                      {p.authors} ·{" "}
                      <em style={{ color: "var(--db-muted)", fontStyle: "italic" }}>
                        {p.journal}
                      </em>{" "}
                      · {p.year}
                    </div>
                    <div
                      style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}
                    >
                      {p.tags.map((t) => (
                        <span
                          key={t}
                          className="db-pill"
                          style={{
                            fontSize: "0.6rem",
                            padding: "0.24rem 0.55rem",
                            borderColor: `rgba(${sec.accentRgb}, 0.28)`,
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
    </PageShell>
  );
}
