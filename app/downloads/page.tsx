import AnimatedSection from "@/components/site/AnimatedSection";
import PageShell from "@/components/site/PageShell";

export const metadata = {
  title: "Downloads — DB²",
  description: "Download genome assembly, annotation files, and datasets for Onthophagus taurus",
};

const CDN = "https://pub-00f0cdc6e97c4fc597b52927f437c27f.r2.dev";

const FILES = [
  {
    icon: "🧬",
    title: "Genome Assembly (FASTA)",
    filename: "Otau3.2.fasta.gz",
    description: "Chromosome-level genome assembly for Onthophagus taurus. bgzip-compressed with FAI and GZI indices.",
    size: "~295 Mb",
    format: "FASTA · bgzip",
    accent: "#22d3ee",
    files: [
      { label: "FASTA.gz",  url: `${CDN}/Otau3.2.fasta.gz`     },
      { label: "FAI index", url: `${CDN}/Otau3.2.fasta.gz.fai` },
      { label: "GZI index", url: `${CDN}/Otau3.2.fasta.gz.gzi` },
    ],
  },
  {
    icon: "📌",
    title: "NCBI Gene Annotation (GFF3)",
    filename: "Ot3_3.2Chrs.sorted.gff3.gz",
    description: "Official NCBI annotation with 28,456 predicted gene models. Sorted and tabix-indexed for JBrowse 2.",
    size: "~28 Mb",
    format: "GFF3 · bgzip · tabix",
    accent: "#818cf8",
    files: [
      { label: "GFF3.gz",     url: `${CDN}/Ot3_3.2Chrs.sorted.gff3.gz`     },
      { label: "Tabix index", url: `${CDN}/Ot3_3.2Chrs.sorted.gff3.gz.tbi` },
    ],
  },
  {
    icon: "🧾",
    title: "GTF Annotation",
    filename: "Ot3_3.2Chrs.sorted.gtf.gz",
    description: "GTF-format annotation file compatible with RNA-seq pipelines (STAR, featureCounts, etc.).",
    size: "~22 Mb",
    format: "GTF · bgzip · tabix",
    accent: "#10b981",
    files: [
      { label: "GTF.gz",      url: `${CDN}/Ot3_3.2Chrs.sorted.gtf.gz`     },
      { label: "Tabix index", url: `${CDN}/Ot3_3.2Chrs.sorted.gtf.gz.tbi` },
    ],
  },
  {
    icon: "📊",
    title: "RNA-seq Datasets",
    filename: "Coming soon",
    description: "Raw reads, genome-aligned BAMs, and expression matrices across developmental stages and tissues.",
    size: "TBD",
    format: "FASTQ · BAM · TSV",
    accent: "#22d3ee",
    files: [],
    soon: true,
  },
  {
    icon: "📋",
    title: "Assembly Metadata",
    filename: "Coming soon",
    description: "Chromosome sizes, contig-to-chromosome mapping, and assembly statistics (N50, L50, BUSCO).",
    size: "< 1 Mb",
    format: "TSV · JSON",
    accent: "#818cf8",
    files: [],
    soon: true,
  },
  {
    icon: "🔖",
    title: "Supplementary Files",
    filename: "Coming soon",
    description: "Repeat masking annotations, gene ontology mappings, and ortholog assignments.",
    size: "TBD",
    format: "BED · TSV",
    accent: "#10b981",
    files: [],
    soon: true,
  },
];

export default function DownloadsPage() {
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
            top: "-10%", right: "10%",
            width: "400px", height: "400px",
            background: "radial-gradient(circle, rgba(34,211,238,0.07) 0%, transparent 70%)",
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
              }}>DB² · Data Access</p>
              <h1 style={{
                fontFamily: "var(--font-sans)",
                fontWeight: 700,
                fontSize: "clamp(2rem, 4vw, 3rem)",
                color: "#e2e8f0",
                letterSpacing: "-0.03em",
                margin: "0 0 1rem",
              }}>
                Downloads
              </h1>
              <p style={{
                fontFamily: "var(--font-sans)",
                fontSize: "0.95rem",
                color: "#64748b",
                maxWidth: "52ch",
                lineHeight: 1.7,
                margin: "0 0 1rem",
              }}>
                Genome assembly, annotation files, and datasets hosted on Cloudflare R2
                for global low-latency access. All files are freely available.
              </p>
              <div style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "6px 14px",
                borderRadius: "8px",
                background: "rgba(34,211,238,0.06)",
                border: "1px solid rgba(34,211,238,0.15)",
                fontFamily: "var(--font-mono)",
                fontSize: "0.72rem",
                color: "#64748b",
              }}>
                <span style={{ color: "#10b981" }}>●</span>
                Hosted on Cloudflare R2 · CDN-distributed
              </div>
            </AnimatedSection>
          </div>
        </div>

        {/* hover styles — keeps page a Server Component */}
        <style>{`
          .dl-link:hover { filter: brightness(1.25); }
        `}</style>

        {/* ── File cards ── */}
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "3rem 1.5rem 5rem" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
            gap: "16px",
          }}>
            {FILES.map((f, i) => (
              <AnimatedSection key={f.title} delay={i * 0.07}>
                <div style={{
                  padding: "1.75rem",
                  borderRadius: "14px",
                  background: "rgba(9,13,26,0.85)",
                  border: `1px solid ${f.soon ? "rgba(26,34,64,0.4)" : `${f.accent}28`}`,
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                  height: "100%",
                  position: "relative",
                  overflow: "hidden",
                }}>
                  <div style={{
                    position: "absolute",
                    top: 0, left: "15%", right: "15%",
                    height: "1px",
                    background: `linear-gradient(90deg, transparent, ${f.accent}70, transparent)`,
                    opacity: f.soon ? 0.2 : 0.8,
                  }} />

                  {/* Header row */}
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px" }}>
                    <div style={{
                      width: "44px", height: "44px",
                      borderRadius: "10px",
                      background: `${f.accent}12`,
                      border: `1px solid ${f.accent}25`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "1.2rem",
                      opacity: f.soon ? 0.5 : 1,
                      flexShrink: 0,
                    }}>
                      {f.icon}
                    </div>
                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", justifyContent: "flex-end" }}>
                      {f.soon ? (
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
                      ) : (
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
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1 }}>
                    <h3 style={{
                      fontFamily: "var(--font-sans)",
                      fontWeight: 600,
                      fontSize: "0.95rem",
                      color: "#e2e8f0",
                      margin: "0 0 6px",
                      opacity: f.soon ? 0.6 : 1,
                    }}>
                      {f.title}
                    </h3>
                    <p style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "0.82rem",
                      color: "#64748b",
                      lineHeight: 1.65,
                      margin: "0 0 10px",
                    }}>
                      {f.description}
                    </p>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      <span style={{
                        padding: "2px 8px",
                        borderRadius: "4px",
                        fontSize: "0.68rem",
                        fontFamily: "var(--font-mono)",
                        color: "#475569",
                        background: "rgba(14,20,38,0.8)",
                        border: "1px solid rgba(26,34,64,0.5)",
                      }}>
                        {f.format}
                      </span>
                      <span style={{
                        padding: "2px 8px",
                        borderRadius: "4px",
                        fontSize: "0.68rem",
                        fontFamily: "var(--font-mono)",
                        color: "#475569",
                        background: "rgba(14,20,38,0.8)",
                        border: "1px solid rgba(26,34,64,0.5)",
                      }}>
                        {f.size}
                      </span>
                    </div>
                  </div>

                  {/* Download buttons */}
                  {!f.soon && f.files.length > 0 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      {f.files.map((dl) => (
                        <a
                          key={dl.label}
                          href={dl.url}
                          target="_blank"
                          rel="noreferrer"
                          className="dl-link"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "8px 12px",
                            borderRadius: "8px",
                            // accent injected via CSS custom prop
                            background: `${f.accent}08`,
                            border: `1px solid ${f.accent}20`,
                            textDecoration: "none",
                            color: f.accent,
                            fontFamily: "var(--font-mono)",
                            fontSize: "0.75rem",
                            transition: "background 0.2s, border-color 0.2s",
                          }}
                        >
                          <span>{dl.label}</span>
                          <span style={{ opacity: 0.6 }}>↓</span>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </AnimatedSection>
            ))}
          </div>

          {/* Usage note */}
          <AnimatedSection style={{ marginTop: "3rem" }}>
            <div style={{
              padding: "1.5rem",
              borderRadius: "12px",
              background: "rgba(9,13,26,0.6)",
              border: "1px solid rgba(26,34,64,0.4)",
              fontFamily: "var(--font-mono)",
              fontSize: "0.78rem",
              color: "#475569",
              lineHeight: 1.8,
            }}>
              <span style={{ color: "#22d3ee" }}>Usage note · </span>
              All files are freely available for research purposes. If you use DB² data,
              please cite the relevant assembly and annotation papers (see Publications).
              For large-scale downloads, use the direct R2 URLs for best performance.
            </div>
          </AnimatedSection>
        </div>
      </div>
    </PageShell>
  );
}
