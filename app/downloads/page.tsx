import AnimatedSection from "@/components/site/AnimatedSection";
import PageShell from "@/components/site/PageShell";

export const metadata = {
  title: "Downloads — DB²",
  description:
    "Download genome assembly, annotation files, and datasets for Onthophagus taurus",
};

const CDN = "https://pub-00f0cdc6e97c4fc597b52927f437c27f.r2.dev";

const FILES = [
  {
    abbr: "FA",
    title: "Genome Assembly (FASTA)",
    filename: "Otau3.2.fasta.gz",
    description:
      "Chromosome-level genome assembly for Onthophagus taurus. bgzip-compressed with FAI and GZI indices.",
    size: "~295 Mb",
    format: "FASTA · bgzip",
    accent: "#00f0ff",
    accentRgb: "0,240,255",
    files: [
      { label: "FASTA.gz", url: `${CDN}/Otau3.2.fasta.gz` },
      { label: "FAI index", url: `${CDN}/Otau3.2.fasta.gz.fai` },
      { label: "GZI index", url: `${CDN}/Otau3.2.fasta.gz.gzi` },
    ],
  },
  {
    abbr: "AN",
    title: "NCBI Gene Annotation (GFF3)",
    filename: "Ot3_3.2Chrs.sorted.gff3.gz",
    description:
      "Official NCBI annotation with 28,456 predicted gene models. Sorted and tabix-indexed for JBrowse 2.",
    size: "~28 Mb",
    format: "GFF3 · bgzip · tabix",
    accent: "#8d7cff",
    accentRgb: "141,124,255",
    files: [
      { label: "GFF3.gz", url: `${CDN}/Ot3_3.2Chrs.sorted.gff3.gz` },
      { label: "Tabix index", url: `${CDN}/Ot3_3.2Chrs.sorted.gff3.gz.tbi` },
    ],
  },
  {
    abbr: "GT",
    title: "GTF Annotation",
    filename: "Ot3_3.2Chrs.sorted.gtf.gz",
    description:
      "GTF-format annotation file compatible with RNA-seq pipelines (STAR, featureCounts, etc.).",
    size: "~22 Mb",
    format: "GTF · bgzip · tabix",
    accent: "#49ffb6",
    accentRgb: "73,255,182",
    files: [
      { label: "GTF.gz", url: `${CDN}/Ot3_3.2Chrs.sorted.gtf.gz` },
      { label: "Tabix index", url: `${CDN}/Ot3_3.2Chrs.sorted.gtf.gz.tbi` },
    ],
  },
  {
    abbr: "RN",
    title: "RNA-seq Datasets",
    filename: "Coming soon",
    description:
      "Raw reads, genome-aligned BAMs, and expression matrices across developmental stages and tissues.",
    size: "TBD",
    format: "FASTQ · BAM · TSV",
    accent: "#00f0ff",
    accentRgb: "0,240,255",
    files: [],
    soon: true,
  },
  {
    abbr: "MT",
    title: "Assembly Metadata",
    filename: "Coming soon",
    description:
      "Chromosome sizes, contig-to-chromosome mapping, and assembly statistics (N50, L50, BUSCO).",
    size: "< 1 Mb",
    format: "TSV · JSON",
    accent: "#8d7cff",
    accentRgb: "141,124,255",
    files: [],
    soon: true,
  },
  {
    abbr: "SU",
    title: "Supplementary Files",
    filename: "Coming soon",
    description:
      "Repeat masking annotations, gene ontology mappings, and ortholog assignments.",
    size: "TBD",
    format: "BED · TSV",
    accent: "#49ffb6",
    accentRgb: "73,255,182",
    files: [],
    soon: true,
  },
];

export default function DownloadsPage() {
  return (
    <PageShell>
      {/* hover style — keeps page a Server Component */}
      <style>{`
        .dl-btn { transition: background 0.2s, border-color 0.2s, opacity 0.2s; }
        .dl-btn:hover { opacity: 0.8; }
      `}</style>

      {/* ── Hero ── */}
      <div
        style={{
          padding: "6rem 1.25rem 4rem",
          borderBottom: "1px solid var(--db-line)",
          position: "relative",
          overflow: "hidden",
          background:
            "radial-gradient(circle at 70% 25%, rgba(0,240,255,0.06), transparent 36%), var(--db-black)",
        }}
      >
        <div style={{ maxWidth: "1540px", margin: "0 auto", position: "relative" }}>
          <AnimatedSection>
            <p className="db-eyebrow">DB² · Data Access</p>
            <h1
              className="db-section-title"
              style={{ fontSize: "clamp(2.8rem, 5vw, 5.5rem)" }}
            >
              Downloads
            </h1>
            <p className="db-section-copy" style={{ marginTop: "1.25rem", marginBottom: "1.5rem" }}>
              Genome assembly, annotation files, and datasets hosted on Cloudflare
              R2 for global low-latency access. All files are freely available.
            </p>
            <div className="db-pill">
              <span className="db-dot" />
              Hosted on Cloudflare R2 · CDN-distributed
            </div>
          </AnimatedSection>
        </div>
      </div>

      {/* ── File cards ── */}
      <div style={{ maxWidth: "1540px", margin: "0 auto", padding: "4rem 1.25rem 6rem" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))",
            gap: "0.9rem",
          }}
        >
          {FILES.map((f, i) => (
            <AnimatedSection key={f.title} delay={i * 0.07}>
              <div
                className="db-glass"
                style={{
                  borderRadius: "22px",
                  padding: "1.6rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                  height: "100%",
                  position: "relative",
                  overflow: "hidden",
                  opacity: f.soon ? 0.7 : 1,
                  ...(!f.soon
                    ? { borderColor: `rgba(${f.accentRgb}, 0.28)` }
                    : {}),
                }}
              >
                {/* Top accent line */}
                {!f.soon && (
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: "12%",
                      right: "12%",
                      height: "1px",
                      background: `linear-gradient(90deg, transparent, rgba(${f.accentRgb}, 0.7), transparent)`,
                    }}
                  />
                )}

                {/* Header */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: "0.75rem",
                  }}
                >
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "12px",
                      background: `rgba(${f.accentRgb}, 0.1)`,
                      border: `1px solid rgba(${f.accentRgb}, 0.22)`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.68rem",
                      color: f.accent,
                      letterSpacing: "0.1em",
                      flexShrink: 0,
                    }}
                  >
                    {f.abbr}
                  </div>
                  {f.soon ? (
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
                      Coming Soon
                    </div>
                  ) : (
                    <div className="db-pill">
                      <span className="db-dot" />
                      Available
                    </div>
                  )}
                </div>

                {/* Info */}
                <div style={{ flex: 1 }}>
                  <h3
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontWeight: 600,
                      fontSize: "1rem",
                      color: "var(--db-cream)",
                      margin: "0 0 0.5rem",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {f.title}
                  </h3>
                  <p
                    style={{
                      color: "var(--db-stone)",
                      fontSize: "0.84rem",
                      lineHeight: 1.68,
                      margin: "0 0 0.75rem",
                    }}
                  >
                    {f.description}
                  </p>
                  <div style={{ display: "flex", gap: "0.45rem", flexWrap: "wrap" }}>
                    <span
                      className="db-pill"
                      style={{ fontSize: "0.62rem", padding: "0.28rem 0.6rem" }}
                    >
                      {f.format}
                    </span>
                    <span
                      className="db-pill"
                      style={{ fontSize: "0.62rem", padding: "0.28rem 0.6rem" }}
                    >
                      {f.size}
                    </span>
                  </div>
                </div>

                {/* Download buttons */}
                {!f.soon && f.files.length > 0 && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
                    {f.files.map((dl) => (
                      <a
                        key={dl.label}
                        href={dl.url}
                        target="_blank"
                        rel="noreferrer"
                        className="dl-btn"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "0.55rem 0.85rem",
                          borderRadius: "10px",
                          background: `rgba(${f.accentRgb}, 0.07)`,
                          border: `1px solid rgba(${f.accentRgb}, 0.18)`,
                          textDecoration: "none",
                          color: f.accent,
                          fontFamily: "var(--font-mono)",
                          fontSize: "0.72rem",
                          letterSpacing: "0.06em",
                        }}
                      >
                        <span>{dl.label}</span>
                        <span style={{ opacity: 0.55 }}>↓</span>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* Usage note */}
        <AnimatedSection style={{ marginTop: "2.5rem" }}>
          <div
            className="db-glass"
            style={{
              borderRadius: "16px",
              padding: "1.35rem 1.5rem",
              fontFamily: "var(--font-mono)",
              fontSize: "0.76rem",
              color: "var(--db-muted)",
              lineHeight: 1.8,
            }}
          >
            <span style={{ color: "var(--db-cyan)" }}>Usage note · </span>
            All files are freely available for research purposes. If you use DB²
            data, please cite the relevant assembly and annotation papers (see
            Publications). For large-scale downloads, use the direct R2 URLs for
            best performance.
          </div>
        </AnimatedSection>
      </div>
    </PageShell>
  );
}
