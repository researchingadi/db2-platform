import AnimatedSection from "@/components/site/AnimatedSection";
import PageShell from "@/components/site/PageShell";

export const metadata = {
  title: "Publications — DB²",
  description: "Genomics research and Davidson Lab publications for Onthophagus taurus",
};

/* All entries are placeholders — not real publications */
const SECTIONS = [
  {
    heading: "Genome Assembly & Annotation",
    color: "#22d3ee",
    papers: [
      {
        title: "Chromosome-level genome assembly of Onthophagus taurus reveals the genomic basis of horn polyphenism",
        authors: "Davidson Lab et al.",
        journal: "placeholder — not a real publication",
        year: "2024",
        tags: ["Assembly", "Annotation", "NCBI"],
      },
      {
        title: "Comparative genomics of dung beetles: structural variation and gene family expansion",
        authors: "Placeholder Authors",
        journal: "placeholder — not a real publication",
        year: "2024",
        tags: ["Comparative genomics", "Gene families"],
      },
    ],
  },
  {
    heading: "Davidson Lab Publications",
    color: "#818cf8",
    papers: [
      {
        title: "Developmental plasticity and the evolution of beetle horns",
        authors: "Davidson Lab",
        journal: "placeholder — representative topic, not a real publication",
        year: "2023",
        tags: ["Plasticity", "Morphology", "Evo-devo"],
      },
      {
        title: "RNA-seq analysis of horn development across nutrition-mediated alternative morphs",
        authors: "Placeholder Authors",
        journal: "placeholder — not a real publication",
        year: "2023",
        tags: ["RNA-seq", "Gene expression", "Polyphenism"],
      },
    ],
  },
  {
    heading: "Dung Beetle Biology",
    color: "#10b981",
    papers: [
      {
        title: "Ecology and evolution of dung beetles: a global perspective",
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
      <div style={{ background: "var(--db-bg)", minHeight: "calc(100vh - 64px)" }}>

        {/* ── Hero ── */}
        <div style={{
          padding: "4rem 1.5rem 3rem",
          borderBottom: "1px solid rgba(26,34,64,0.4)",
          position: "relative",
          overflow: "hidden",
        }}>
          <div style={{
            position: "absolute",
            top: "-30%", right: "5%",
            width: "400px", height: "400px",
            background: "radial-gradient(circle, rgba(129,140,248,0.08) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />
          <div style={{ maxWidth: "1280px", margin: "0 auto", position: "relative" }}>
            <AnimatedSection>
              <p style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.7rem",
                color: "#818cf8",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                marginBottom: "12px",
              }}>DB² · Literature</p>
              <h1 style={{
                fontFamily: "var(--font-sans)",
                fontWeight: 700,
                fontSize: "clamp(2rem, 4vw, 3rem)",
                color: "#e2e8f0",
                letterSpacing: "-0.03em",
                margin: "0 0 1rem",
              }}>
                Publications
              </h1>
              <p style={{
                fontFamily: "var(--font-sans)",
                fontSize: "0.95rem",
                color: "#64748b",
                maxWidth: "52ch",
                lineHeight: 1.7,
                margin: "0 0 12px",
              }}>
                Research papers associated with the DB² platform, Davidson Lab, and the
                broader dung beetle genomics community.
              </p>
              <span style={{
                display: "inline-block",
                padding: "4px 12px",
                borderRadius: "6px",
                fontFamily: "var(--font-mono)",
                fontSize: "0.68rem",
                color: "#818cf8",
                background: "rgba(129,140,248,0.08)",
                border: "1px solid rgba(129,140,248,0.2)",
              }}>
                ⚠ All entries below are placeholders and do not represent real publications
              </span>
            </AnimatedSection>
          </div>
        </div>

        {/* ── Sections ── */}
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "3rem 1.5rem 5rem" }}>
          {SECTIONS.map((sec, si) => (
            <AnimatedSection key={sec.heading} delay={si * 0.1} style={{ marginBottom: "3rem" }}>
              {/* Section header */}
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "1.25rem",
              }}>
                <div style={{ width: "3px", height: "24px", borderRadius: "2px", background: sec.color }} />
                <h2 style={{
                  fontFamily: "var(--font-sans)",
                  fontWeight: 600,
                  fontSize: "1rem",
                  color: "#94a3b8",
                  letterSpacing: "0.02em",
                  margin: 0,
                }}>
                  {sec.heading}
                </h2>
              </div>

              {/* Paper cards */}
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {sec.papers.map((p, pi) => (
                  <AnimatedSection key={p.title} delay={si * 0.1 + pi * 0.07}>
                    <div style={{
                      padding: "1.5rem",
                      borderRadius: "12px",
                      background: "rgba(9,13,26,0.8)",
                      border: "1px solid rgba(26,34,64,0.5)",
                      borderLeft: `3px solid ${sec.color}40`,
                      transition: "border-color 0.2s",
                    }}>
                      <h3 style={{
                        fontFamily: "var(--font-sans)",
                        fontWeight: 600,
                        fontSize: "0.95rem",
                        color: "#e2e8f0",
                        margin: "0 0 8px",
                        lineHeight: 1.5,
                      }}>
                        {p.title}
                      </h3>
                      <div style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: "0.82rem",
                        color: "#64748b",
                        marginBottom: "6px",
                      }}>
                        {p.authors} · <em>{p.journal}</em> · {p.year}
                      </div>
                      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "10px" }}>
                        {p.tags.map((t) => (
                          <span key={t} style={{
                            padding: "2px 8px",
                            borderRadius: "4px",
                            fontSize: "0.65rem",
                            fontFamily: "var(--font-mono)",
                            color: sec.color,
                            background: `${sec.color}10`,
                            border: `1px solid ${sec.color}25`,
                          }}>
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
      </div>
    </PageShell>
  );
}
