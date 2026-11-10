import { and, eq } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";
import BlastResults from "@/components/blast/BlastResults";
import PageShell from "@/components/site/PageShell";
import { db, schema } from "@/lib/db";
import { idSchema } from "@/lib/saved-blast";
import { requireApprovedUser } from "@/lib/session";

export const metadata = { title: "Saved BLAST search — DB²", robots: { index: false } };

const t = schema.savedBlastJobs;
const dateFmt = new Intl.DateTimeFormat("en-US", { year: "numeric", month: "short", day: "numeric" });

const dt: React.CSSProperties = { fontFamily: "var(--font-sans)", fontSize: "0.8rem", fontWeight: 600, color: "var(--db-stone)" };
const dd: React.CSSProperties = {
  margin: 0,
  fontFamily: "var(--font-sans)",
  fontSize: "0.92rem",
  color: "var(--db-cream)",
  overflowWrap: "anywhere",
};

export default async function SavedBlastJobPage({ params }: { params: { id: string } }) {
  const user = await requireApprovedUser(`/account/blast-jobs/${params.id}`);
  if (!idSchema.safeParse(params.id).success) notFound();

  // Filtered by both the job id and the session user's id: other users' jobs 404.
  const [job] = await db
    .select()
    .from(t)
    .where(and(eq(t.id, params.id), eq(t.userId, user.id)));
  if (!job) notFound();

  return (
    <PageShell>
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "4rem 1.25rem 6rem" }}>
        <p className="db-eyebrow">
          <Link href="/account/blast-jobs" className="auth-inline-link" style={{ color: "inherit" }}>
            DB² · Saved BLAST searches
          </Link>
        </p>
        <h1 className="arcade-title" style={{ fontSize: "clamp(1.1rem, 2.6vw, 1.6rem)", overflowWrap: "anywhere" }}>
          {job.label}
        </h1>

        <section className="arcade-panel" style={{ marginTop: "2rem" }} aria-labelledby="settings-h">
          <h2 id="settings-h" className="arcade-panel__bar">
            Search settings
          </h2>
          <div style={{ padding: "1.5rem", display: "grid", gap: "1.25rem" }}>
            <dl
              style={{
                margin: 0,
                display: "grid",
                gridTemplateColumns: "minmax(7rem, max-content) 1fr",
                gap: "0.6rem 1.5rem",
                alignItems: "baseline",
              }}
            >
              <dt style={dt}>Program</dt>
              <dd style={dd}>{job.program}</dd>
              <dt style={dt}>Database</dt>
              <dd style={dd}>{job.database}</dd>
              <dt style={dt}>Search against</dt>
              <dd style={dd}>{job.entrezQuery || "(no restriction)"}</dd>
              <dt style={dt}>E-value</dt>
              <dd style={dd}>{job.evalue}</dd>
              <dt style={dt}>Max hits</dt>
              <dd style={dd}>{job.hitlistSize}</dd>
              <dt style={dt}>RID</dt>
              <dd style={dd}>{job.rid}</dd>
              <dt style={dt}>Saved</dt>
              <dd style={dd}>
                {dateFmt.format(job.createdAt)}
                {job.updatedAt.getTime() - job.createdAt.getTime() > 1000 ? ` · updated ${dateFmt.format(job.updatedAt)}` : ""}
              </dd>
            </dl>
            <div>
              <div style={{ ...dt, marginBottom: "0.4rem" }}>Query</div>
              <pre
                style={{
                  margin: 0,
                  maxHeight: "12rem",
                  overflow: "auto",
                  padding: "0.8rem",
                  border: "2px solid var(--db-line-strong)",
                  background: "var(--db-black)",
                  color: "var(--db-cream)",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.78rem",
                  lineHeight: 1.5,
                  whiteSpace: "pre-wrap",
                  overflowWrap: "anywhere",
                }}
              >
                {job.querySequence}
              </pre>
            </div>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
              <Link href={`/blast?from=${job.id}`} className="arcade-btn arcade-btn--cta">
                Run again
              </Link>
              <Link href="/account/blast-jobs" className="auth-inline-link" style={{ fontFamily: "var(--font-sans)", fontSize: "0.9rem" }}>
                Back to saved searches
              </Link>
            </div>
          </div>
        </section>

        <div style={{ marginTop: "2.5rem" }}>
          {/* Stored results: rendered from our database, no request to NCBI. */}
          <BlastResults
            results={job.resultJson}
            program={job.program}
            database={job.database}
            rid={job.rid}
            querySequence={job.querySequence}
          />
        </div>
      </div>
    </PageShell>
  );
}
