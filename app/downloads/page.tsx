import AnimatedSection from "@/components/site/AnimatedSection";
import PageShell from "@/components/site/PageShell";

export const metadata = {
  title: "Downloads — DB²",
  description:
    "Download genome assemblies, annotation files, and datasets for dung beetle species",
};

const CDN = "https://pub-00f0cdc6e97c4fc597b52927f437c27f.r2.dev";

type FileRow = {
  filename: string;
  description: string;
  format: string;
  size: string;
  url: string;
};

type Species = {
  id: string;
  label: string;
  scientific: string;
  assembly: string;
  accentRgb: string;
  accent: string;
  files: FileRow[];
  note?: string;
};

const SPECIES: Species[] = [
  {
    id: "otaurus",
    label: "O. taurus",
    scientific: "Onthophagus taurus",
    assembly: "Otau_3.2",
    accent: "#00f0ff",
    accentRgb: "0,240,255",
    note: "Masked genome, protein, and nucleotide sequences coming soon",
    files: [
      {
        filename: "Otau3.2.fasta.gz",
        description: "Genome assembly",
        format: "FASTA",
        size: "70 MB",
        url: `${CDN}/Otau3.2.fasta.gz`,
      },
      {
        filename: "Ot3_3.2Chrs.sorted.gff3.gz",
        description: "NCBI Gene Annotation",
        format: "GFF3",
        size: "5.8 MB",
        url: `${CDN}/Ot3_3.2Chrs.sorted.gff3.gz`,
      },
      {
        filename: "Ot3_3.2Chrs.sorted.gtf.gz",
        description: "GTF Annotation",
        format: "GTF",
        size: "6.2 MB",
        url: `${CDN}/Ot3_3.2Chrs.sorted.gtf.gz`,
      },
    ],
  },
  {
    id: "osagittarius",
    label: "O. sagittarius",
    scientific: "Onthophagus sagittarius",
    assembly: "Osag_1.3",
    accent: "#8d7cff",
    accentRgb: "141,124,255",
    files: [
      {
        filename: "Osag1.3.fasta.gz",
        description: "Genome assembly",
        format: "FASTA",
        size: "134 MB",
        url: `${CDN}/osagittarius/Osag1.3.fasta.gz`,
      },
      {
        filename: "Osag1.3.sorted.gtf.gz",
        description: "Gene Annotation (AUGUSTUS)",
        format: "GTF",
        size: "1.8 MB",
        url: `${CDN}/osagittarius/Osag1.3.sorted.gtf.gz`,
      },
      {
        filename: "Osag1.3_masked.fasta.gz",
        description: "Repeat-masked genome",
        format: "FASTA",
        size: "158 MB",
        url: `${CDN}/osagittarius/Osag1.3_masked.fasta.gz`,
      },
      {
        filename: "Osag1.3_nuc.fasta.gz",
        description: "Gene nucleotide sequences",
        format: "FASTA",
        size: "8 MB",
        url: `${CDN}/osagittarius/Osag1.3_nuc.fasta.gz`,
      },
      {
        filename: "Osag1.3_pep.fasta.gz",
        description: "Protein sequences",
        format: "FASTA",
        size: "5 MB",
        url: `${CDN}/osagittarius/Osag1.3_pep.fasta.gz`,
      },
    ],
  },
  {
    id: "dgazella",
    label: "D. gazella",
    scientific: "Digitonthophagus gazella",
    assembly: "Dgaz_1.3",
    accent: "#49ffb6",
    accentRgb: "73,255,182",
    files: [
      {
        filename: "Dgaz1.3.fasta.gz",
        description: "Genome assembly",
        format: "FASTA",
        size: "86 MB",
        url: `${CDN}/dgazella/Dgaz1.3.fasta.gz`,
      },
      {
        filename: "Dgaz1.3.sorted.gtf.gz",
        description: "Gene Annotation (AUGUSTUS)",
        format: "GTF",
        size: "1.6 MB",
        url: `${CDN}/dgazella/Dgaz1.3.sorted.gtf.gz`,
      },
      {
        filename: "Dgaz1.3_masked.fasta.gz",
        description: "Repeat-masked genome",
        format: "FASTA",
        size: "101 MB",
        url: `${CDN}/dgazella/Dgaz1.3_masked.fasta.gz`,
      },
      {
        filename: "Dgaz1.3_nuc.fasta.gz",
        description: "Gene nucleotide sequences",
        format: "FASTA",
        size: "8 MB",
        url: `${CDN}/dgazella/Dgaz1.3_nuc.fasta.gz`,
      },
      {
        filename: "Dgaz1.3_pep.fasta.gz",
        description: "Protein sequences",
        format: "FASTA",
        size: "5 MB",
        url: `${CDN}/dgazella/Dgaz1.3_pep.fasta.gz`,
      },
    ],
  },
  {
    id: "obinodis",
    label: "O. binodis",
    scientific: "Onthophagus binodis",
    assembly: "Obin_1.0",
    accent: "#f59e0b",
    accentRgb: "245,158,11",
    files: [
      {
        filename: "Obin1.0.fasta.gz",
        description: "Genome assembly",
        format: "FASTA",
        size: "195 MB",
        url: `${CDN}/obinodis/Obin1.0.fasta.gz`,
      },
      {
        filename: "Obin1.0.sorted.gtf.gz",
        description: "Gene Annotation (AUGUSTUS)",
        format: "GTF",
        size: "2.5 MB",
        url: `${CDN}/obinodis/Obin1.0.sorted.gtf.gz`,
      },
      {
        filename: "Obin1.0_masked.fasta.gz",
        description: "Repeat-masked genome",
        format: "FASTA",
        size: "245 MB",
        url: `${CDN}/obinodis/Obin1.0_masked.fasta.gz`,
      },
      {
        filename: "Obin1.0_nuc.fa.gz",
        description: "Gene nucleotide sequences",
        format: "FASTA",
        size: "7 MB",
        url: `${CDN}/obinodis/Obin1.0_nuc.fa.gz`,
      },
      {
        filename: "Obin1.0_pep.fa.gz",
        description: "Protein sequences",
        format: "FASTA",
        size: "4 MB",
        url: `${CDN}/obinodis/Obin1.0_pep.fa.gz`,
      },
    ],
  },
];

export default function DownloadsPage() {
  return (
    <PageShell>
      <style>{`
        .dl-btn { transition: opacity 0.15s; }
        .dl-btn:hover { opacity: 0.75; }
        .dl-row:hover { background: rgba(255,255,255,0.025); }
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
              Genome assemblies, annotation files, and sequences for four dung beetle
              species. All files are hosted on Cloudflare R2 and freely available.
            </p>
            <div className="db-pill">
              <span className="db-dot" />
              Hosted on Cloudflare R2 · CDN-distributed
            </div>
          </AnimatedSection>
        </div>
      </div>

      {/* ── Species sections ── */}
      <div style={{ maxWidth: "1540px", margin: "0 auto", padding: "4rem 1.25rem 6rem" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>
          {SPECIES.map((sp, si) => (
            <AnimatedSection key={sp.id} delay={si * 0.08}>
              {/* Section header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: "1rem",
                  marginBottom: "1rem",
                  flexWrap: "wrap",
                }}
              >
                <h2
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontWeight: 700,
                    fontSize: "1.05rem",
                    color: "var(--db-cream)",
                    margin: 0,
                    letterSpacing: "-0.02em",
                  }}
                >
                  <em style={{ fontStyle: "italic", color: sp.accent }}>{sp.scientific}</em>
                </h2>
                <span
                  className="db-pill"
                  style={{
                    fontSize: "0.6rem",
                    padding: "0.22rem 0.55rem",
                    borderColor: `rgba(${sp.accentRgb}, 0.3)`,
                    color: sp.accent,
                  }}
                >
                  {sp.assembly}
                </span>
              </div>

              {/* Table */}
              <div
                className="db-glass"
                style={{ borderRadius: "16px", overflow: "hidden", borderColor: `rgba(${sp.accentRgb}, 0.18)` }}
              >
                {/* Table head */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "2fr 2fr 80px 72px 110px",
                    gap: "0",
                    padding: "0.6rem 1.25rem",
                    borderBottom: `1px solid rgba(${sp.accentRgb}, 0.14)`,
                    background: `rgba(${sp.accentRgb}, 0.04)`,
                  }}
                >
                  {["File", "Description", "Format", "Size", "Download"].map((col) => (
                    <span
                      key={col}
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.62rem",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: "var(--db-muted)",
                      }}
                    >
                      {col}
                    </span>
                  ))}
                </div>

                {/* Rows */}
                {sp.files.map((f, fi) => (
                  <div
                    key={f.filename}
                    className="dl-row"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "2fr 2fr 80px 72px 110px",
                      gap: "0",
                      padding: "0.8rem 1.25rem",
                      alignItems: "center",
                      borderBottom:
                        fi < sp.files.length - 1
                          ? "1px solid rgba(244,241,232,0.06)"
                          : "none",
                      transition: "background 0.15s",
                    }}
                  >
                    {/* Filename */}
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.72rem",
                        color: "var(--db-stone)",
                        letterSpacing: "0.02em",
                        wordBreak: "break-all",
                        paddingRight: "1rem",
                      }}
                    >
                      {f.filename}
                    </span>

                    {/* Description */}
                    <span
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: "0.82rem",
                        color: "var(--db-stone)",
                        paddingRight: "1rem",
                      }}
                    >
                      {f.description}
                    </span>

                    {/* Format */}
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.68rem",
                        color: sp.accent,
                        letterSpacing: "0.05em",
                      }}
                    >
                      {f.format}
                    </span>

                    {/* Size */}
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.7rem",
                        color: "var(--db-muted)",
                      }}
                    >
                      {f.size}
                    </span>

                    {/* Download */}
                    <a
                      href={f.url}
                      download
                      target="_blank"
                      rel="noreferrer"
                      className="dl-btn"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "5px",
                        padding: "4px 12px",
                        borderRadius: "6px",
                        background: "rgba(99,102,241,0.12)",
                        border: "1px solid rgba(99,102,241,0.25)",
                        color: "#818cf8",
                        fontSize: "11.5px",
                        fontFamily: "var(--font-mono)",
                        textDecoration: "none",
                        whiteSpace: "nowrap",
                      }}
                    >
                      ↓ Download
                    </a>
                  </div>
                ))}
              </div>

              {/* Per-species note */}
              {sp.note && (
                <p
                  style={{
                    marginTop: "0.65rem",
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.66rem",
                    color: "var(--db-muted)",
                    letterSpacing: "0.06em",
                  }}
                >
                  ◌ {sp.note}
                </p>
              )}
            </AnimatedSection>
          ))}
        </div>

        {/* Usage note */}
        <AnimatedSection style={{ marginTop: "3rem" }}>
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
