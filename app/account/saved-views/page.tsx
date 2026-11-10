import { desc, eq } from "drizzle-orm";
import Link from "next/link";
import PageShell from "@/components/site/PageShell";
import { db, schema } from "@/lib/db";
import { SPECIES_LIST } from "@/lib/jbrowse-config";
import { MAX_VIEWS_PER_USER } from "@/lib/saved-views";
import { requireApprovedUser } from "@/lib/session";
import ViewsTable, { type ViewRow } from "./ViewsTable";

export const metadata = { title: "Saved genome views — DB²" };

const t = schema.savedViews;

export default async function SavedViewsPage() {
  const user = await requireApprovedUser("/account/saved-views");

  const rows = await db
    .select({
      id: t.id,
      kind: t.kind,
      label: t.label,
      note: t.note,
      speciesId: t.speciesId,
      locus: t.locus,
      trackIds: t.trackIds,
      createdAt: t.createdAt,
    })
    .from(t)
    .where(eq(t.userId, user.id))
    .orderBy(desc(t.createdAt));

  const names = Object.fromEntries(SPECIES_LIST.map((s) => [s.id, s.scientificName]));
  const views: ViewRow[] = rows.map((r) => ({
    id: r.id,
    kind: r.kind,
    label: r.label,
    note: r.note,
    speciesId: r.speciesId,
    speciesName: names[r.speciesId] ?? r.speciesId,
    locus: r.locus,
    trackCount: Array.isArray(r.trackIds) ? r.trackIds.length : 0,
    createdAt: r.createdAt.toISOString(),
  }));

  return (
    <PageShell>
      <div style={{ maxWidth: "1540px", margin: "0 auto", padding: "4rem 1.25rem 6rem" }}>
        <p className="db-eyebrow">
          <Link href="/account" className="auth-inline-link" style={{ color: "inherit" }}>
            DB² · Account
          </Link>
        </p>
        <h1 className="arcade-title" style={{ fontSize: "clamp(1.3rem, 3vw, 1.9rem)" }}>
          Saved genome views
        </h1>
        <p style={{ marginTop: "1rem", fontFamily: "var(--font-sans)", fontSize: "0.95rem", color: "var(--db-stone)" }}>
          {views.length} of {MAX_VIEWS_PER_USER} saved. Bookmarks keep a location; sessions also reopen the tracks you had open.
        </p>

        <div style={{ marginTop: "2rem" }}>
          {views.length === 0 ? (
            <section className="arcade-panel" style={{ padding: "1.5rem", maxWidth: "640px" }}>
              <p style={{ margin: 0, fontFamily: "var(--font-sans)", fontSize: "0.95rem", color: "var(--db-stone)" }}>
                You haven't saved any views yet. Open the{" "}
                <Link href="/genome-browser/otaurus" className="auth-inline-link">
                  genome browser
                </Link>
                , go to a location and use “Save view” in the species bar.
              </p>
            </section>
          ) : (
            <ViewsTable views={views} />
          )}
        </div>
      </div>
    </PageShell>
  );
}
