import { NextResponse } from "next/server";
import { getCurrentUser, type CurrentUser } from "./session";

export function jsonError(status: number, error: string, headers?: HeadersInit) {
  return NextResponse.json({ error }, { status, headers });
}

/**
 * For API routes that need an approved account. Returns the user, or a ready
 * error response: 401 if logged out, 403 if the account isn't approved.
 */
export async function requireApprovedApiUser(): Promise<{ user: CurrentUser } | { response: NextResponse }> {
  const user = await getCurrentUser();
  if (!user) return { response: jsonError(401, "Log in to use saved searches.") };
  if (user.status !== "approved") {
    return { response: jsonError(403, "Saving is available once your account is approved.") };
  }
  return { user };
}

/**
 * Same-origin check for state-changing requests. Session cookies are SameSite=Lax
 * (not sent on cross-site POST/PATCH/DELETE), so this is defence in depth.
 */
export function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true; // same-origin fetches from older browsers / server tools
  try {
    const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}
