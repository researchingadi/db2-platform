import AnimatedSection from "@/components/site/AnimatedSection";
import PageShell from "@/components/site/PageShell";

export const metadata = {
  title: "Resources — DB²",
  description: "Genome assembly, annotation files, RNA-seq data, and documentation for Onthophagus taurus",
};

const RESOURCES = [
  {
    icon: "🧬",
    title: "Genome Assembly",
    description:
      "Chromosome-level genome assembly for Onthophagus taurus (Otau_3.2 / IU_Otau_3.0). NCBI accession GCF_036711975.1. 12 chromosomes, ~295 Mb.",
    tags: ["FASTA", "GFF3", "NCBI RefSeq"],
    href: "/downloads",
    accent: "#22d3ee",
    status: "available",
  },
  {
    icon: "📌",
    title: "NCBI Gene Annotation",
    description:
      "Official NCBI annotation track with 28,456 predicted gene models mapped to the Otau_3.2 assembly. GFF3 format with tabix index.",
    tags: ["GFF3", "Tabix", "28,456 genes"],
    href: "/downloads",
    accent: "#818cf8",
    status: "available",
  },
  {
    icon: "🧾",
    title: "GTF Annotation",
    description:
      "GTF-format annotation file sorted and indexed for use with genome browsers and bioinformatics pipelines.",
    tags: ["GTF", "Tabix", "JBrowse 2"],
    href: "/downloads",
    accent: "#10b981",
    status: "available",
  },
  {
    icon: "📊",
    title: "RNA-seq Datasets",
    description:
      "Transcriptomics data across developmental stages and tissues. Includes raw reads, alignments, and expression matrices.",
    tags: ["FASTQ", "BAM", "TPM matrix"],
    href: "#",
    accent: "#22d3ee",
    status: "coming-soon",
  },
  {
    icon: "📚",
    title: "Documentation",
    description:
      "Guides for using the genome browser, downloading data files, and interpreting annotation tracks.",
    tags: ["User guide", "API", "Tutorials"],
    href: "#",
    accent: "#818cf8",
    status: "coming-soon",
  },
  {
    icon: "⚡",
    title: "BLAST Interface",
    description:
      "Align sequences against the Otau_3.2 assembly and predicted proteome. Local BLAST with genome-browser integration.",
    tags: ["BLAST+", "Nucleotide", "Protein"],
    href: "#",
    accent: "#10b981",
    status: "coming-soon",
  },
];

export default function ResourcesPage() {
  return (
    <PageShell>
      <div style={{ background: "var(--db-bg)", minHeight: "calc(100vh - 64px)" }}>

        {/* ── Page hero ── */}
        <div style={{
          padding: "4rem 1.5rem 3rem",
          borderBottom: "1px solid rgba(26,34,64,0.4)",
          position: "relative",
          overflow: "hidden",
        }}>
          {/* gradient blob */}
          <div style={{
            position: "absolute",
            top: "-20%", left: "60%",
            width: "500px", height: "400px",
            background: "radial-gradient(circle, rgba(34,211,238,0.08) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />
          <div style={{ maxWidth: "1280px", margin: "0 auto", position: "relative" }}>
            <AnimatedSection>
              <p style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.7rem",
                color: "#22d3ee",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                marginBottom: "12px",
              }}>
                DB² · Resources
              </p>
              <h1 style={{
                fontFamily: "var(--font-sans)",
                fontWeight: 700,
                fontSize: "clamp(2rem, 4vw, 3rem)",
                color: "#e2e8f0",
                letterSpacing: "-0.03em",
                margin: "0 0 1rem",
              }}>
                Genomic Resources
              </h1>
              <p style={{
                fontFamily: "var(--font-sans)",
                fontSize: "0.95rem",
                color: "#64748b",
                maxWidth: "54ch",
                lineHeight: 1.7,
                margin: 0,
              }}>
                All data, annotations, and tools available for{" "}
                <em style={{ color: "#94a3b8" }}>Onthophagus taurus</em> genomics research.
                Files are hosted on Cloudflare R2 for global low-latency access.
              </p>
            </AnimatedSection>
          </div>
        </div>

        {/* ── Resource cards ── */}
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "3rem 1.5rem 5rem" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "16px",
          }}>
            {RESOURCES.map((r, i) => (
              <AnimatedSection key={r.title} delay={i * 0.07}>
                <div style={{
                  padding: "1.75rem",
                  borderRadius: "14px",
                  background: "rgba(9,13,26,0.8)",
                  border: `1px solid ${r.status === "available" ? `${r.accent}30` : "rgba(26,34,64,0.5)"}`,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                  position: "relative",
                  overflow: "hidden",
                }}>
                  {/* top rule */}
                  <div style={{
                    position: "absolute",
                    top: 0, left: "10%", right: "10%",
                    height: "1px",
                    background: `linear-gradient(90deg, transparent, ${r.accent}80, transparent)`,
                    opacity: r.status === "available" ? 0.8 : 0.2,
                  }} />

                  {/* icon + status */}
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                    <div style={{
                      width: "44px", height: "44px",
                      borderRadius: "10px",
                      background: `${r.accent}15`,
                      border: `1px solid ${r.accent}30`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "1.2rem",
                      opacity: r.status === "available" ? 1 : 0.5,
                    }}>
                      {r.icon}
                    </div>
                    {r.status === "coming-soon" && (
                      <span style={{
                        padding: "3px 10px",
                        borderRadius: "4px",
                        fontSize: "0.65rem",
                        fontFamily: "var(--font-mono)",
                        color: "#818cf8",
                        background: "rgba(129,140,248,0.1)",
                        border: "1px solid rgba(129,140,248,0.2)",
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                      }}>
                        Coming Soon
                      </span>
                    )}
                    {r.status === "available" && (
                      <span style={{
                        padding: "3px 10px",
                        borderRadius: "4px",
                        fontSize: "0.65rem",
                        fontFamily: "var(--font-mono)",
                        color: "#10b981",
                        background: "rgba(16,185,129,0.1)",
                        border: "1px solid rgba(16,185,129,0.2)",
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                      }}>
                        Available
                      </span>
                    )}
                  </div>

                  {/* text */}
                  <div style={{ flex: 1 }}>
                    <h3 style={{
                      fontFamily: "var(--font-sans)",
                      fontWeight: 600,
                      fontSize: "1rem",
                      color: "#e2e8f0",
                      margin: "0 0 8px",
                      opacity: r.status === "available" ? 1 : 0.6,
                    }}>
                      {r.title}
                    </h3>
                    <p style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "0.85rem",
                      color: "#64748b",
                      lineHeight: 1.65,
                      margin: 0,
                    }}>
                      {r.description}
                    </p>
                  </div>

                  {/* tags */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {r.tags.map((t) => (
                      <span key={t} style={{
                        padding: "3px 10px",
                        borderRadius: "4px",
                        fontSize: "0.68rem",
                        fontFamily: "var(--font-mono)",
                        color: "#475569",
                        background: "rgba(14,20,38,0.8)",
                        border: "1px solid rgba(26,34,64,0.5)",
                      }}>
                        {t}
                      </span>
                    ))}
                  </div>

                  {r.status === "available" && (
                    <a href={r.href} style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      color: r.accent,
                      textDecoration: "none",
                      fontSize: "0.8rem",
                      fontFamily: "var(--font-mono)",
                    }}>
                      View downloads →
                    </a>
                  )}
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
