import AnimatedSection from "@/components/site/AnimatedSection";
import PageShell from "@/components/site/PageShell";
import ReducedMotion from "@/components/site/ReducedMotion";

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
    accent: "var(--db-cyan)",
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
    accent: "var(--db-violet)",
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
    accent: "var(--db-green)",
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
    accent: "var(--db-cyan)",
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

const TOTAL_FILES = SPECIES.reduce((acc, sp) => acc + sp.files.length, 0);
const TOTAL_SIZE_GB = (
  SPECIES.reduce(
    (acc, sp) => acc + sp.files.reduce((a, f) => a + parseFloat(f.size), 0),
    0
  ) / 1024
).toFixed(1);

export default function DownloadsPage() {
  return (
    <PageShell>
      <style>{`
        .dl-btn { white-space: nowrap; }
        .dl-row:hover { background: var(--db-panel-2); }
      `}</style>
      <ReducedMotion>
        {/* ── Cinematic header ── */}
        <section
          style={{
            position: "relative",
            minHeight: "300px",
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
              opacity: 0.65,
            }}
          >
            <source src="/downloads-bg.mp4" type="video/mp4" />
          </video>
          <div
            style={{
              position: "relative",
              zIndex: 1,
              minHeight: "300px",
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
                <p className="db-eyebrow">Genomic Data Repository · CC BY 4.0</p>
                <h1
                  className="arcade-title"
                  style={{
                    fontSize: "clamp(1.4rem, 3.2vw, 2rem)",
                    margin: 0,
                    lineHeight: 1.3,
                  }}
                >
                  Downloads
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
                  Genome assemblies, annotations, masked genomes, protein and
                  nucleotide sequences for all four dung beetle species. Hosted on
                  Cloudflare R2.
                </p>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginTop: "14px",
                    flexWrap: "wrap",
                  }}
                >
                  {[
                    `${SPECIES.length} Species`,
                    `${TOTAL_FILES} Files`,
                    `~${TOTAL_SIZE_GB} GB Total`,
                  ].map((stat, i) => (
                    <span key={stat} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      {i > 0 && <span style={{ color: "var(--db-stone)", fontSize: "14px" }}>·</span>}
                      <span
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: "14px",
                          color: "var(--db-cyan)",
                        }}
                      >
                        {stat}
                      </span>
                    </span>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* ── Species sections ── */}
        <div style={{ maxWidth: "1540px", margin: "0 auto", padding: "4rem 1.25rem 6rem" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>
            {SPECIES.map((sp, si) => (
              <AnimatedSection key={sp.id} delay={si * 0.08}>
                {/* Table panel; the species heading is its title bar */}
                <div
                  className="arcade-panel"
                  style={{ padding: 0, overflow: "hidden", borderColor: sp.accent }}
                >
                  <div
                    className="arcade-panel__bar"
                    style={{
                      justifyContent: "flex-start",
                      flexWrap: "wrap",
                      gap: "0.75rem 1rem",
                      background: sp.accent,
                      borderBottomColor: sp.accent,
                    }}
                  >
                    <h2
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontWeight: 700,
                        fontSize: "16px",
                        textTransform: "none",
                        color: "var(--db-black)",
                        margin: 0,
                      }}
                    >
                      <em style={{ fontStyle: "italic", color: "var(--db-black)" }}>{sp.scientific}</em>
                    </h2>
                    <span
                      className="arcade-chip"
                      style={{
                        borderColor: "var(--db-black)",
                        color: sp.accent,
                        textTransform: "none",
                      }}
                    >
                      {sp.assembly}
                    </span>
                  </div>

                  {/* Table (scrolls inside the panel on narrow screens) */}
                  <div style={{ overflowX: "auto" }}>
                    <table className="blast-table" style={{ minWidth: "720px" }}>
                      <thead>
                        <tr>
                          {["File", "Description", "Format", "Size", "Download"].map((col) => (
                            <th key={col}>{col}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {sp.files.map((f) => (
                          <tr key={f.filename} className="dl-row">
                            {/* Filename */}
                            <td
                              style={{
                                fontFamily: "var(--font-mono)",
                                fontSize: "14px",
                                color: "var(--db-cream)",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {f.filename}
                            </td>

                            {/* Description */}
                            <td
                              style={{
                                fontFamily: "var(--font-sans)",
                                fontSize: "14px",
                                color: "var(--db-stone)",
                              }}
                            >
                              {f.description}
                            </td>

                            {/* Format */}
                            <td
                              style={{
                                fontFamily: "var(--font-mono)",
                                fontSize: "14px",
                                color: sp.accent,
                              }}
                            >
                              {f.format}
                            </td>

                            {/* Size */}
                            <td
                              style={{
                                fontFamily: "var(--font-mono)",
                                fontSize: "14px",
                                color: "var(--db-cream)",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {f.size}
                            </td>

                            {/* Download */}
                            <td>
                              <a
                                href={f.url}
                                download
                                target="_blank"
                                rel="noreferrer"
                                className="dl-btn arcade-btn arcade-btn--small pixel-glyphs"
                              >
                                ↓ Download
                              </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Per-species note */}
                {sp.note && (
                  <p
                    style={{
                      marginTop: "0.85rem",
                      fontFamily: "var(--font-sans)",
                      fontSize: "14px",
                      color: "var(--db-stone)",
                      lineHeight: 1.5,
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
              className="arcade-panel"
              style={{
                padding: "1.35rem 1.5rem",
                fontFamily: "var(--font-sans)",
                fontSize: "15px",
                color: "var(--db-stone)",
                lineHeight: 1.7,
              }}
            >
              <span style={{ color: "var(--db-cyan)", fontWeight: 600 }}>Usage note · </span>
              All files are freely available for research purposes. If you use DB²
              data, please cite the relevant assembly and annotation papers (see
              Publications). For large-scale downloads, use the direct R2 URLs for
              best performance.
            </div>
          </AnimatedSection>
        </div>
      </ReducedMotion>
    </PageShell>
  );
}
