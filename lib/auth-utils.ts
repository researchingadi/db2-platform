/* Small helpers usable from both server and client components. */

/** Map a Better Auth client error to a message the user can act on. */
export function authErrorMessage(
  error: { message?: string; status?: number } | null | undefined,
  fallback = "Something went wrong. Please try again.",
): string {
  if (!error) return fallback;
  if (error.status === 429) return "Too many attempts. Please wait a minute and try again.";
  return error.message || fallback;
}

/** Only allow same-site relative paths as a post-login redirect target. */
export function safeNext(next: string | undefined | null, fallback = "/account"): string {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) return fallback;
  return next;
}
