import { desc, eq } from "drizzle-orm";
import Link from "next/link";
import PageShell from "@/components/site/PageShell";
import { db, schema } from "@/lib/db";
import { MAX_JOBS_PER_USER } from "@/lib/saved-blast";
import { requireApprovedUser } from "@/lib/session";
import JobsTable, { type JobRow } from "./JobsTable";

export const metadata = { title: "Saved BLAST searches — DB²" };

const t = schema.savedBlastJobs;

export default async function SavedBlastJobsPage() {
  const user = await requireApprovedUser("/account/blast-jobs");

  // Only this user's rows, and never the stored result JSON.
  const rows = await db
    .select({
      id: t.id,
      label: t.label,
      program: t.program,
      database: t.database,
      numHits: t.numHits,
      bestHitTitle: t.bestHitTitle,
      bestEvalue: t.bestEvalue,
      createdAt: t.createdAt,
    })
    .from(t)
    .where(eq(t.userId, user.id))
    .orderBy(desc(t.createdAt));

  const jobs: JobRow[] = rows.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() }));

  return (
    <PageShell>
      <div style={{ maxWidth: "1540px", margin: "0 auto", padding: "4rem 1.25rem 6rem" }}>
        <p className="db-eyebrow">
          <Link href="/account" className="auth-inline-link" style={{ color: "inherit" }}>
            DB² · Account
          </Link>
        </p>
        <h1 className="arcade-title" style={{ fontSize: "clamp(1.3rem, 3vw, 1.9rem)" }}>
          Saved BLAST searches
        </h1>
        <p
          style={{
            marginTop: "1rem",
            fontFamily: "var(--font-sans)",
            fontSize: "0.95rem",
            color: "var(--db-stone)",
          }}
        >
          {jobs.length} of {MAX_JOBS_PER_USER} saved. Results are stored here, so they stay available after NCBI deletes
          them.
        </p>

        <div style={{ marginTop: "2rem" }}>
          {jobs.length === 0 ? (
            <section className="arcade-panel" style={{ padding: "1.5rem", maxWidth: "640px" }}>
              <p style={{ margin: 0, fontFamily: "var(--font-sans)", fontSize: "0.95rem", color: "var(--db-stone)" }}>
                You haven't saved any BLAST searches yet. Run a search on the{" "}
                <Link href="/blast" className="auth-inline-link">
                  BLAST page
                </Link>{" "}
                and use “Save this search” on the results.
              </p>
            </section>
          ) : (
            <JobsTable jobs={jobs} />
          )}
        </div>
      </div>
    </PageShell>
  );
}
