import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { isSameOrigin, jsonError, requireApprovedApiUser } from "@/lib/api-auth";
import { db, schema } from "@/lib/db";
import { idSchema, updateViewSchema, viewColumns } from "@/lib/saved-views";

export const dynamic = "force-dynamic";

const t = schema.savedViews;
type Ctx = { params: { id: string } };

// Someone else's id (or a malformed one) is indistinguishable from a missing one.
const notFound = () => jsonError(404, "Saved view not found.");

export async function GET(_request: Request, { params }: Ctx) {
  const auth = await requireApprovedApiUser();
  if ("response" in auth) return auth.response;
  if (!idSchema.safeParse(params.id).success) return notFound();
  const [view] = await db
    .select(viewColumns)
    .from(t)
    .where(and(eq(t.id, params.id), eq(t.userId, auth.user.id)));
  if (!view) return notFound();
  return NextResponse.json({ view });
}

/* Rename and/or edit the note. */
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
  const parsed = updateViewSchema.safeParse(body);
  if (!parsed.success) return jsonError(400, parsed.error.issues[0]?.message ?? "Invalid request.");

  const changes: { label?: string; note?: string | null; updatedAt: Date } = { updatedAt: new Date() };
  if (parsed.data.label !== undefined) changes.label = parsed.data.label;
  if (parsed.data.note !== undefined) changes.note = parsed.data.note ? parsed.data.note : null;

  const [row] = await db
    .update(t)
    .set(changes)
    .where(and(eq(t.id, params.id), eq(t.userId, auth.user.id)))
    .returning(viewColumns);
  if (!row) return notFound();
  return NextResponse.json({ view: row });
}

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
