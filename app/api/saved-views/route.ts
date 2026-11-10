import { count, desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { isSameOrigin, jsonError, requireApprovedApiUser } from "@/lib/api-auth";
import { db, schema } from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";
import { createViewSchema, defaultViewLabel, MAX_VIEWS_PER_USER, speciesById, viewColumns } from "@/lib/saved-views";

export const dynamic = "force-dynamic";

const t = schema.savedViews;
const MAX_BODY_BYTES = 16 * 1024;

/* The current user's saved views, newest first. */
export async function GET() {
  const auth = await requireApprovedApiUser();
  if ("response" in auth) return auth.response;
  const views = await db.select(viewColumns).from(t).where(eq(t.userId, auth.user.id)).orderBy(desc(t.createdAt));
  return NextResponse.json({ views });
}

/* Save a bookmark (location) or a session (location + open tracks). */
export async function POST(request: Request) {
  if (!isSameOrigin(request)) return jsonError(403, "Cross-origin request blocked.");
  const auth = await requireApprovedApiUser();
  if ("response" in auth) return auth.response;
  const userId = auth.user.id;

  const limit = rateLimit(`saved-views:post:${userId}`, 30, 600);
  if (!limit.ok) {
    return jsonError(429, "Too many saves. Please wait a few minutes and try again.", {
      "Retry-After": String(limit.retryAfter),
    });
  }

  const raw = await request.text();
  if (Buffer.byteLength(raw, "utf8") > MAX_BODY_BYTES) return jsonError(413, "Request is too large.");
  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return jsonError(400, "Request body must be JSON.");
  }
  const parsed = createViewSchema.safeParse(body);
  if (!parsed.success) return jsonError(400, parsed.error.issues[0]?.message ?? "Invalid request.");
  const input = parsed.data;
  const species = speciesById(input.speciesId)!; // validated above

  const outcome = await db.transaction(async (tx) => {
    const [{ n }] = await tx.select({ n: count() }).from(t).where(eq(t.userId, userId));
    if (n >= MAX_VIEWS_PER_USER) return null;
    const [row] = await tx
      .insert(t)
      .values({
        userId,
        kind: input.kind,
        label: input.label && input.label.length > 0 ? input.label : defaultViewLabel(input.speciesId, input.locus),
        note: input.note,
        speciesId: input.speciesId,
        assemblyName: species.assemblyName, // derived server-side, never trusted from the client
        locus: input.locus,
        trackIds: input.kind === "session" ? [...new Set(input.trackIds)] : [],
      })
      .returning(viewColumns);
    return row;
  });

  if (!outcome) {
    return jsonError(409, `You can save up to ${MAX_VIEWS_PER_USER} views. Delete some saved views to save new ones.`);
  }
  return NextResponse.json({ view: outcome }, { status: 201 });
}
