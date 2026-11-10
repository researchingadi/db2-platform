import AnimatedSection from "@/components/site/AnimatedSection";
import PageShell from "@/components/site/PageShell";
import ReducedMotion from "@/components/site/ReducedMotion";

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
    accent: "var(--db-cyan)",
    status: "available",
  },
  {
    abbr: "AN",
    title: "NCBI Gene Annotation",
    description:
      "Official NCBI annotation track with 28,456 predicted gene models mapped to the Otau_3.2 assembly. GFF3 format with tabix index.",
    tags: ["GFF3", "Tabix", "28,456 genes"],
    href: "/downloads",
    accent: "var(--db-violet)",
    status: "available",
  },
  {
    abbr: "GT",
    title: "GTF Annotation",
    description:
      "GTF-format annotation file sorted and indexed for use with genome browsers and bioinformatics pipelines.",
    tags: ["GTF", "Tabix", "JBrowse 2"],
    href: "/downloads",
    accent: "var(--db-green)",
    status: "available",
  },
  {
    abbr: "RN",
    title: "RNA-seq Datasets",
    description:
      "Transcriptomics data across developmental stages and tissues. Includes raw reads, alignments, and expression matrices.",
    tags: ["FASTQ", "BAM", "TPM matrix"],
    href: "#",
    accent: "var(--db-cyan)",
    status: "coming-soon",
  },
  {
    abbr: "DC",
    title: "Documentation",
    description:
      "Guides for using the genome browser, downloading data files, and interpreting annotation tracks.",
    tags: ["User guide", "API", "Tutorials"],
    href: "#",
    accent: "var(--db-violet)",
    status: "coming-soon",
  },
  {
    abbr: "BL",
    title: "BLAST Interface",
    description:
      "Align sequences against the Otau_3.2 assembly and predicted proteome. Local BLAST with genome-browser integration.",
    tags: ["BLAST+", "Nucleotide", "Protein"],
    href: "#",
    accent: "var(--db-green)",
    status: "coming-soon",
  },
];

export default function ResourcesPage() {
  return (
    <PageShell>
      <ReducedMotion>
      {/* ── Page hero ── */}
      <div
        style={{
          padding: "5rem 1.25rem 3.5rem",
          borderBottom: "var(--arcade-border) solid var(--db-cream)",
          position: "relative",
          overflow: "hidden",
          background: "var(--db-black)",
        }}
      >
        <div style={{ maxWidth: "1540px", margin: "0 auto", position: "relative" }}>
          <AnimatedSection>
            <p className="db-eyebrow">DB² · Resources</p>
            <h1
              className="arcade-title"
              style={{ fontSize: "clamp(1.4rem, 3.4vw, 2.2rem)", lineHeight: 1.3, marginTop: "14px", overflowWrap: "anywhere" }}
            >
              Genomic Resources
            </h1>
            <p
              style={{
                marginTop: "1.25rem",
                maxWidth: "62ch",
                fontFamily: "var(--font-sans)",
                fontSize: "15px",
                lineHeight: 1.7,
                color: "var(--db-stone)",
              }}
            >
              All data, annotations, and tools available for{" "}
              <em style={{ color: "var(--db-cream)", fontStyle: "italic" }}>
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
            gridTemplateColumns: "repeat(auto-fill, minmax(min(340px, 100%), 1fr))",
            gap: "24px",
          }}
        >
          {RESOURCES.map((r, i) => (
            <AnimatedSection key={r.title} delay={i * 0.07}>
              <div
                className="arcade-panel"
                style={{
                  padding: "0 22px 22px",
                  minHeight: "280px",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                  ...(r.status === "available"
                    ? { borderColor: r.accent }
                    : { borderStyle: "dashed", borderColor: "var(--db-stone)" }),
                }}
              >
                {/* Header = title bar: abbreviation tile + status */}
                <div
                  className="arcade-panel__bar"
                  style={{
                    margin: "0 -22px",
                    padding: "0.55rem 0.75rem",
                    alignItems: "center",
                    ...(r.status === "available"
                      ? { background: r.accent, borderBottomColor: r.accent }
                      : { background: "var(--db-stone)", borderBottomColor: "var(--db-stone)" }),
                  }}
                >
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      background: "var(--db-black)",
                      border: "2px solid var(--db-black)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "var(--font-pixel)",
                      fontSize: "0.6rem",
                      color: r.status === "available" ? r.accent : "var(--db-cream)",
                    }}
                  >
                    {r.abbr}
                  </div>
                  {r.status === "coming-soon" ? (
                    <div style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem", color: "var(--db-black)" }}>
                      <span
                        className="blink"
                        style={{
                          width: "0.55rem",
                          height: "0.55rem",
                          background: "var(--db-black)",
                          display: "inline-block",
                        }}
                      />
                      Soon
                    </div>
                  ) : (
                    <div style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem", color: "var(--db-black)" }}>
                      <span className="arcade-dot" style={{ background: "var(--db-black)" }} />
                      Live
                    </div>
                  )}
                </div>

                {/* Content */}
                <div style={{ flex: 1 }}>
                  <h3
                    className="arcade-title"
                    style={{
                      margin: "0 0 0.85rem",
                      fontSize: "0.8rem",
                      lineHeight: 1.5,
                    }}
                  >
                    {r.title}
                  </h3>
                  <p
                    style={{
                      margin: 0,
                      color: "var(--db-stone)",
                      lineHeight: 1.7,
                      fontSize: "15px",
                      fontFamily: "var(--font-sans)",
                    }}
                  >
                    {r.description}
                  </p>
                </div>

                {/* Tags */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  {r.tags.map((tag) => (
                    <span
                      key={tag}
                      className="arcade-chip"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                {r.status === "available" && (
                  <a
                    href={r.href}
                    className="arcade-btn arcade-btn--small"
                    style={{ alignSelf: "flex-start" }}
                  >
                    View downloads
                  </a>
                )}
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
      </ReducedMotion>
    </PageShell>
  );
}
