"use client";

import { inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import type { auth } from "./auth";

// Same-origin client; talks to app/api/auth/[...all]/route.ts.
// `import type` is erased at build time, so no server code reaches the browser.
// Note: Better Auth's client types need "strictNullChecks": true (set in tsconfig.json).
export const authClient = createAuthClient({
  plugins: [inferAdditionalFields<typeof auth>()],
});
