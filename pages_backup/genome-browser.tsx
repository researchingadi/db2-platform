import Head from "next/head";
import JBrowseWrapper from "@/components/genome/JBrowseWrapper";
import { DB2_ASSEMBLY, DB2_TRACKS } from "@/lib/jbrowse-config";

const TRACK_META = [
  { id: "ncbi-annotations", label: "NCBI Gene Annotation", format: "GFF3" },
  { id: "gtf-annotations",  label: "GTF Annotation",       format: "GTF"  },
] as const;

export default function GenomeBrowserPage() {
  return (
    <>
      <Head>
        <title>Genome Browser — DB²</title>
        <meta
          name="description"
          content="Linear genome viewer for Ostreococcus tauri assembly Otau 3.2"
        />
      </Head>

      <main className="genome-page">

        {/* ── Header ── */}
        <header className="genome-page__header">
          <div className="genome-page__eyebrow">DB² · Genome Viewer</div>
          <h1 className="genome-page__title">Genome Browser</h1>
          <p className="genome-page__subtitle">
            Interactive linear genome view — explore sequence features and annotations
            across the <em>Ostreococcus tauri</em> reference assembly.
          </p>
        </header>

        {/* ── Assembly + track metadata strip ── */}
        <section className="genome-page__meta" aria-label="Assembly information">
          <dl className="genome-page__meta-grid">
            <div className="genome-page__meta-item">
              <dt>Assembly</dt>
              <dd>{DB2_ASSEMBLY.name}</dd>
            </div>
            <div className="genome-page__meta-item">
              <dt>Organism</dt>
              <dd><em>Ostreococcus tauri</em></dd>
            </div>
            <div className="genome-page__meta-item">
              <dt>Sequence</dt>
              <dd>BgzipFASTA</dd>
            </div>
            {TRACK_META.map((t) => (
              <div className="genome-page__meta-item" key={t.id}>
                <dt>{t.label}</dt>
                <dd><span className="genome-page__badge">{t.format}</span></dd>
              </div>
            ))}
          </dl>
        </section>

        {/* ── Genome viewer ── */}
        <section className="genome-page__viewer" aria-label="Genome browser viewer">
          <JBrowseWrapper assembly={DB2_ASSEMBLY} tracks={DB2_TRACKS} />
        </section>

        <style>{`
          .genome-page {
            --gb-bg:          #080e14;
            --gb-surface:     #0d1620;
            --gb-border:      #162433;
            --gb-accent:      #29d9a0;
            --gb-accent-dim:  #1a8a64;
            --gb-text:        #ccd6e0;
            --gb-text-muted:  #5a7a8a;
            --gb-badge-bg:    #0a2a1e;
            --gb-badge-fg:    #29d9a0;

            min-height: 100vh;
            background: var(--gb-bg);
            color: var(--gb-text);
            font-family: 'Geist Sans', ui-sans-serif, system-ui, sans-serif;
            padding: 3rem 2rem 4rem;
            max-width: 1400px;
            margin: 0 auto;
          }

          .genome-page__header {
            margin-bottom: 2rem;
            border-left: 3px solid var(--gb-accent);
            padding-left: 1.25rem;
          }

          .genome-page__eyebrow {
            font-family: 'Geist Mono', 'Courier New', monospace;
            font-size: 0.65rem;
            letter-spacing: 0.18em;
            text-transform: uppercase;
            color: var(--gb-accent);
            margin-bottom: 0.5rem;
            opacity: 0.85;
          }

          .genome-page__title {
            font-size: clamp(1.75rem, 4vw, 2.75rem);
            font-weight: 700;
            letter-spacing: -0.02em;
            line-height: 1.1;
            color: #e8f4f0;
            margin: 0 0 0.75rem;
          }

          .genome-page__subtitle {
            font-size: 0.9rem;
            line-height: 1.65;
            color: var(--gb-text-muted);
            max-width: 56ch;
            margin: 0;
          }
          .genome-page__subtitle em { color: var(--gb-text); font-style: italic; }

          .genome-page__meta {
            margin-bottom: 1.5rem;
            background: var(--gb-surface);
            border: 1px solid var(--gb-border);
            border-radius: 6px;
            padding: 1rem 1.25rem;
          }

          .genome-page__meta-grid {
            display: flex;
            flex-wrap: wrap;
            gap: 0 2.5rem;
            margin: 0;
          }

          .genome-page__meta-item {
            display: flex;
            flex-direction: column;
            gap: 0.15rem;
            padding: 0.4rem 0;
          }

          .genome-page__meta-item dt {
            font-family: 'Geist Mono', monospace;
            font-size: 0.6rem;
            letter-spacing: 0.14em;
            text-transform: uppercase;
            color: var(--gb-text-muted);
          }

          .genome-page__meta-item dd {
            font-size: 0.85rem;
            font-weight: 500;
            color: var(--gb-text);
            margin: 0;
          }
          .genome-page__meta-item dd em { font-style: italic; }

          .genome-page__badge {
            display: inline-block;
            padding: 0.1em 0.55em;
            background: var(--gb-badge-bg);
            color: var(--gb-badge-fg);
            border: 1px solid var(--gb-accent-dim);
            border-radius: 3px;
            font-family: 'Geist Mono', monospace;
            font-size: 0.7rem;
            letter-spacing: 0.06em;
          }

          .genome-page__viewer {
            border: 1px solid var(--gb-border);
            border-radius: 6px;
            overflow: hidden;
            background: var(--gb-surface);
            box-shadow:
              0 0 0 1px rgba(41, 217, 160, 0.04),
              0 8px 32px rgba(0, 0, 0, 0.4);
          }
        `}</style>
      </main>
    </>
  );
}
