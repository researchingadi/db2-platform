import AnimatedSection from "@/components/site/AnimatedSection";
import PageShell from "@/components/site/PageShell";

export const metadata = {
  title: "Resources — DB²",
  description: "Genome assembly, annotation files, RNA-seq data, and documentation for Onthophagus taurus",
};

const RESOURCES = [
  {
    abbr: "FA",
    title: "Genome Assembly",
    description:
      "Chromosome-level genome assembly for Onthophagus taurus (Otau_3.2 / IU_Otau_3.0). NCBI accession GCF_036711975.1. 12 chromosomes, ~295 Mb.",
    tags: ["FASTA", "GFF3", "NCBI RefSeq"],
    href: "/downloads",
    accent: "#00f0ff",
    accentRgb: "0,240,255",
    status: "available",
  },
  {
    abbr: "AN",
    title: "NCBI Gene Annotation",
    description:
      "Official NCBI annotation track with 28,456 predicted gene models mapped to the Otau_3.2 assembly. GFF3 format with tabix index.",
    tags: ["GFF3", "Tabix", "28,456 genes"],
    href: "/downloads",
    accent: "#8d7cff",
    accentRgb: "141,124,255",
    status: "available",
  },
  {
    abbr: "GT",
    title: "GTF Annotation",
    description:
      "GTF-format annotation file sorted and indexed for use with genome browsers and bioinformatics pipelines.",
    tags: ["GTF", "Tabix", "JBrowse 2"],
    href: "/downloads",
    accent: "#49ffb6",
    accentRgb: "73,255,182",
    status: "available",
  },
  {
    abbr: "RN",
    title: "RNA-seq Datasets",
    description:
      "Transcriptomics data across developmental stages and tissues. Includes raw reads, alignments, and expression matrices.",
    tags: ["FASTQ", "BAM", "TPM matrix"],
    href: "#",
    accent: "#00f0ff",
    accentRgb: "0,240,255",
    status: "coming-soon",
  },
  {
    abbr: "DC",
    title: "Documentation",
    description:
      "Guides for using the genome browser, downloading data files, and interpreting annotation tracks.",
    tags: ["User guide", "API", "Tutorials"],
    href: "#",
    accent: "#8d7cff",
    accentRgb: "141,124,255",
    status: "coming-soon",
  },
  {
    abbr: "BL",
    title: "BLAST Interface",
    description:
      "Align sequences against the Otau_3.2 assembly and predicted proteome. Local BLAST with genome-browser integration.",
    tags: ["BLAST+", "Nucleotide", "Protein"],
    href: "#",
    accent: "#49ffb6",
    accentRgb: "73,255,182",
    status: "coming-soon",
  },
];

export default function ResourcesPage() {
  return (
    <PageShell>
      {/* ── Page hero ── */}
      <div
        style={{
          padding: "6rem 1.25rem 4rem",
          borderBottom: "1px solid var(--db-line)",
          position: "relative",
          overflow: "hidden",
          background:
            "radial-gradient(circle at 65% 30%, rgba(0,240,255,0.07), transparent 38%), var(--db-black)",
        }}
      >
        <div style={{ maxWidth: "1540px", margin: "0 auto", position: "relative" }}>
          <AnimatedSection>
            <p className="db-eyebrow">DB² · Resources</p>
            <h1
              className="db-section-title"
              style={{ fontSize: "clamp(2.8rem, 5vw, 5.5rem)" }}
            >
              Genomic Resources
            </h1>
            <p className="db-section-copy" style={{ marginTop: "1.25rem" }}>
              All data, annotations, and tools available for{" "}
              <em style={{ color: "var(--db-stone)", fontStyle: "italic" }}>
                Onthophagus taurus
              </em>{" "}
              genomics research. Files hosted on Cloudflare R2 for global
              low-latency access.
            </p>
          </AnimatedSection>
        </div>
      </div>

      {/* ── Resource cards ── */}
      <div style={{ maxWidth: "1540px", margin: "0 auto", padding: "4rem 1.25rem 6rem" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
            gap: "0.9rem",
          }}
        >
          {RESOURCES.map((r, i) => (
            <AnimatedSection key={r.title} delay={i * 0.07}>
              <div
                className="db-glass db-noise-card"
                style={{
                  borderRadius: "22px",
                  padding: "1.6rem",
                  minHeight: "280px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                  opacity: r.status === "coming-soon" ? 0.7 : 1,
                  ...(r.status === "available"
                    ? { borderColor: `rgba(${r.accentRgb}, 0.28)` }
                    : {}),
                }}
              >
                {/* Header */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "12px",
                      background: `rgba(${r.accentRgb}, 0.1)`,
                      border: `1px solid rgba(${r.accentRgb}, 0.25)`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.68rem",
                      color: r.accent,
                      letterSpacing: "0.1em",
                      fontWeight: 500,
                    }}
                  >
                    {r.abbr}
                  </div>
                  {r.status === "coming-soon" ? (
                    <div className="db-pill">
                      <span
                        style={{
                          width: "0.42rem",
                          height: "0.42rem",
                          borderRadius: "999px",
                          background: "var(--db-muted)",
                          display: "inline-block",
                        }}
                      />
                      Soon
                    </div>
                  ) : (
                    <div className="db-pill">
                      <span className="db-dot" />
                      Live
                    </div>
                  )}
                </div>

                {/* Content */}
                <div style={{ flex: 1 }}>
                  <h3
                    style={{
                      margin: "0 0 0.55rem",
                      fontSize: "1.05rem",
                      letterSpacing: "-0.03em",
                      color: "var(--db-cream)",
                      fontWeight: 600,
                      lineHeight: 1.2,
                    }}
                  >
                    {r.title}
                  </h3>
                  <p
                    style={{
                      margin: 0,
                      color: "var(--db-stone)",
                      lineHeight: 1.7,
                      fontSize: "0.84rem",
                    }}
                  >
                    {r.description}
                  </p>
                </div>

                {/* Tags */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                  {r.tags.map((tag) => (
                    <span
                      key={tag}
                      className="db-pill"
                      style={{ fontSize: "0.62rem", padding: "0.28rem 0.6rem" }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                {r.status === "available" && (
                  <a
                    href={r.href}
                    className="db-magnetic-link"
                    style={{ color: r.accent, fontSize: "0.7rem" }}
                  >
                    View downloads
                  </a>
                )}
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
