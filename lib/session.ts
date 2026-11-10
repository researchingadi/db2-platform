import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { auth } from "./auth";
import { db, schema } from "./db";

/*
 * Server-side session helpers for server components and server actions.
 * The user row is always re-read from the database by the session's user id,
 * so a status/role change takes effect on the next request.
 */

export type CurrentUser = {
  id: string;
  name: string;
  email: string;
  institution: string | null;
  status: "pending" | "approved" | "rejected";
  role: "user" | "admin";
  createdAt: Date;
};

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const session = await auth.api.getSession({ headers: headers() });
  if (!session) return null;
  const row = await db.query.user.findFirst({
    where: eq(schema.user.id, session.user.id),
    columns: {
      id: true,
      name: true,
      email: true,
      institution: true,
      status: true,
      role: true,
      createdAt: true,
    },
  });
  return row ?? null;
}

/** For /account: must be logged in and approved. */
export async function requireApprovedUser(next = "/account"): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(next)}`);
  if (user.status !== "approved") redirect(`/login?blocked=${user.status}`);
  return user;
}

/** For /admin: anyone who isn't an approved admin gets a 404. */
export async function requireAdmin(): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin" || user.status !== "approved") notFound();
  return user;
}
