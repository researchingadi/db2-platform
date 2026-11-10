import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { jsonError, isSameOrigin, requireApprovedApiUser } from "@/lib/api-auth";
import { db, schema } from "@/lib/db";
import { idSchema, renameSchema } from "@/lib/saved-blast";

export const dynamic = "force-dynamic";

const t = schema.savedBlastJobs;
type Ctx = { params: { id: string } };

// Someone else's id (or a malformed one) is indistinguishable from a missing one.
const notFound = () => jsonError(404, "Saved search not found.");

/* One job. ?summary=1 omits the stored results (used to pre-fill the BLAST form). */
export async function GET(request: Request, { params }: Ctx) {
  const auth = await requireApprovedApiUser();
  if ("response" in auth) return auth.response;
  if (!idSchema.safeParse(params.id).success) return notFound();

  const summaryOnly = new URL(request.url).searchParams.get("summary") === "1";
  const [job] = await db
    .select({
      id: t.id,
      label: t.label,
      engine: t.engine,
      rid: t.rid,
      program: t.program,
      database: t.database,
      entrezQuery: t.entrezQuery,
      evalue: t.evalue,
      hitlistSize: t.hitlistSize,
      querySequence: t.querySequence,
      numHits: t.numHits,
      bestHitTitle: t.bestHitTitle,
      bestEvalue: t.bestEvalue,
      createdAt: t.createdAt,
      updatedAt: t.updatedAt,
      ...(summaryOnly ? {} : { results: t.resultJson }),
    })
    .from(t)
    .where(and(eq(t.id, params.id), eq(t.userId, auth.user.id)));

  if (!job) return notFound();
  return NextResponse.json({ job });
}

/* Rename. */
export async function PATCH(request: Request, { params }: Ctx) {
  if (!isSameOrigin(request)) return jsonError(403, "Cross-origin request blocked.");
  const auth = await requireApprovedApiUser();
  if ("response" in auth) return auth.response;
  if (!idSchema.safeParse(params.id).success) return notFound();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError(400, "Request body must be JSON.");
  }
  const parsed = renameSchema.safeParse(body);
  if (!parsed.success) return jsonError(400, parsed.error.issues[0]?.message ?? "Invalid label.");

  const [row] = await db
    .update(t)
    .set({ label: parsed.data.label, updatedAt: new Date() })
    .where(and(eq(t.id, params.id), eq(t.userId, auth.user.id)))
    .returning({ id: t.id, label: t.label });

  if (!row) return notFound();
  return NextResponse.json({ job: row });
}

/* Delete. */
export async function DELETE(request: Request, { params }: Ctx) {
  if (!isSameOrigin(request)) return jsonError(403, "Cross-origin request blocked.");
  const auth = await requireApprovedApiUser();
  if ("response" in auth) return auth.response;
  if (!idSchema.safeParse(params.id).success) return notFound();

  const [row] = await db
    .delete(t)
    .where(and(eq(t.id, params.id), eq(t.userId, auth.user.id)))
    .returning({ id: t.id });

  if (!row) return notFound();
  return NextResponse.json({ deleted: row.id });
}
