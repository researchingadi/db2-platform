import { and, count, desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { jsonError, isSameOrigin, requireApprovedApiUser } from "@/lib/api-auth";
import { db, schema } from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";
import {
  defaultLabel,
  MAX_JOBS_PER_USER,
  MAX_REQUEST_BYTES,
  MAX_RESULT_BYTES,
  ncbiResultsSchema,
  saveBodySchema,
  summarize,
} from "@/lib/saved-blast";

export const dynamic = "force-dynamic";

const t = schema.savedBlastJobs;

/* List the current user's saved jobs, newest first, without the stored results. */
export async function GET() {
  const auth = await requireApprovedApiUser();
  if ("response" in auth) return auth.response;

  const jobs = await db
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
      numHits: t.numHits,
      bestHitTitle: t.bestHitTitle,
      bestEvalue: t.bestEvalue,
      createdAt: t.createdAt,
      updatedAt: t.updatedAt,
    })
    .from(t)
    .where(eq(t.userId, auth.user.id))
    .orderBy(desc(t.createdAt));

  return NextResponse.json({ jobs });
}

/* Save (or update, for the same RID) a finished BLAST search with its full results. */
export async function POST(request: Request) {
  if (!isSameOrigin(request)) return jsonError(403, "Cross-origin request blocked.");
  const auth = await requireApprovedApiUser();
  if ("response" in auth) return auth.response;
  const userId = auth.user.id;

  const limit = rateLimit(`saved-blast:post:${userId}`, 20, 600);
  if (!limit.ok) {
    return jsonError(429, "Too many saves. Please wait a few minutes and try again.", {
      "Retry-After": String(limit.retryAfter),
    });
  }

  // Read the raw body ourselves so oversized requests are refused before parsing.
  const declared = Number(request.headers.get("content-length") ?? 0);
  if (declared > MAX_REQUEST_BYTES) return jsonError(413, "This search is too large to save (results are over 5 MB).");
  const raw = await request.text();
  if (Buffer.byteLength(raw, "utf8") > MAX_REQUEST_BYTES) {
    return jsonError(413, "This search is too large to save (results are over 5 MB).");
  }

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return jsonError(400, "Request body must be JSON.");
  }

  const parsed = saveBodySchema.safeParse(body);
  if (!parsed.success) return jsonError(400, parsed.error.issues[0]?.message ?? "Invalid request.");
  const input = parsed.data;

  const resultText = JSON.stringify(input.results ?? null);
  if (Buffer.byteLength(resultText, "utf8") > MAX_RESULT_BYTES) {
    return jsonError(413, "These results are too large to save (over 5 MB).");
  }
  const shape = ncbiResultsSchema.safeParse(input.results);
  if (!shape.success) {
    return jsonError(400, "These don't look like NCBI BLAST results (expected a BlastOutput2 array).");
  }
  const summary = summarize(shape.data);
  const label = input.label && input.label.length > 0 ? input.label : defaultLabel(input.program, input.querySequence);

  const outcome = await db.transaction(async (tx) => {
    const [existing] = await tx
      .select({ id: t.id })
      .from(t)
      .where(and(eq(t.userId, userId), eq(t.rid, input.rid)));
    if (!existing) {
      const [{ n }] = await tx.select({ n: count() }).from(t).where(eq(t.userId, userId));
      if (n >= MAX_JOBS_PER_USER) return { capped: true as const };
    }
    const values = {
      userId,
      label,
      engine: "ncbi",
      rid: input.rid,
      program: input.program,
      database: input.database,
      entrezQuery: input.entrezQuery,
      evalue: input.evalue,
      hitlistSize: input.hitlistSize,
      querySequence: input.querySequence,
      resultJson: input.results, // original object, stored as-is
      ...summary,
    };
    const [row] = await tx
      .insert(t)
      .values(values)
      .onConflictDoUpdate({
        target: [t.userId, t.rid],
        set: { ...values, updatedAt: new Date() },
      })
      .returning({ id: t.id, label: t.label, numHits: t.numHits });
    return { capped: false as const, row, updated: Boolean(existing) };
  });

  if (outcome.capped) {
    return jsonError(
      409,
      `You can save up to ${MAX_JOBS_PER_USER} BLAST searches. Delete some saved searches to save new ones.`,
    );
  }
  return NextResponse.json({ job: outcome.row, updated: outcome.updated }, { status: outcome.updated ? 200 : 201 });
}
