import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { nextCookies } from "better-auth/next-js";
import { eq, or } from "drizzle-orm";
import { PHASE_PRODUCTION_BUILD } from "next/constants";
import { db, schema } from "./db";
import { sendEmail } from "./email";
import {
  ADMIN_EMAILS,
  BLOCKED_MESSAGES,
  EMAIL_VERIFICATION_REQUIRED,
  LAB_NOTIFY_EMAIL,
  MAX_PASSWORD_LENGTH,
  MIN_PASSWORD_LENGTH,
  REGISTRATION_MODE,
  signUpSchema,
} from "./auth-config";

const isProd = process.env.NODE_ENV === "production";
const siteUrl = process.env.BETTER_AUTH_URL ?? "http://localhost:3000";

// Better Auth initialises eagerly and crashes the process in production when
// BETTER_AUTH_SECRET is missing. `next build` imports this module while collecting
// page data, often without runtime secrets (e.g. inside a Docker build), so use a
// placeholder during the build phase only. It never signs a real request; at
// runtime (`next start`) a missing secret still fails loudly.
const isBuildPhase = process.env.NEXT_PHASE === PHASE_PRODUCTION_BUILD;
const secret =
  process.env.BETTER_AUTH_SECRET ||
  (isBuildPhase ? "build-phase-placeholder-secret-not-used-for-any-request" : undefined);

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  secret,
  database: drizzleAdapter(db, { provider: "pg", schema }),

  user: {
    additionalFields: {
      institution: { type: "string", required: true, input: true },
      purpose: { type: "string", required: true, input: true },
      // input: false → clients can never set these; they're decided server-side below.
      status: { type: "string", required: false, defaultValue: "pending", input: false },
      role: { type: "string", required: false, defaultValue: "user", input: false },
    },
    deleteUser: {
      enabled: true,
      // Sessions and accounts are removed by ON DELETE CASCADE; clear leftover tokens too.
      afterDelete: async (deleted) => {
        await db
          .delete(schema.verification)
          .where(
            or(
              eq(schema.verification.value, deleted.id),
              eq(schema.verification.identifier, deleted.email),
            ),
          );
      },
    },
  },

  emailAndPassword: {
    enabled: true,
    minPasswordLength: MIN_PASSWORD_LENGTH,
    maxPasswordLength: MAX_PASSWORD_LENGTH,
    requireEmailVerification: EMAIL_VERIFICATION_REQUIRED,
    // Only sign straight in when nothing else has to happen first.
    autoSignIn: REGISTRATION_MODE === "open" && !EMAIL_VERIFICATION_REQUIRED,
    revokeSessionsOnPasswordReset: true,
    sendResetPassword: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: "Reset your DB² password",
        text: `Hi ${user.name},\n\nSomeone asked to reset the password for your DB² account. To choose a new password, open this link (it expires in 1 hour):\n\n${url}\n\nIf you didn't ask for this, you can ignore this email.`,
      });
    },
  },

  emailVerification: {
    sendOnSignUp: EMAIL_VERIFICATION_REQUIRED,
    autoSignInAfterVerification: false,
    sendVerificationEmail: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: "Verify your email for DB²",
        text: `Hi ${user.name},\n\nPlease confirm your email address for your DB² account:\n\n${url}`,
      });
    },
  },

  rateLimit: {
    enabled: true,
    window: 60,
    max: 100,
    // Per client IP. Campus networks often share one IP, so keep these loose
    // enough for a class registering together while still stopping scripted bursts.
    customRules: {
      "/sign-in/email": { window: 60, max: 10 },
      "/sign-up/email": { window: 60, max: 5 },
      "/request-password-reset": { window: 600, max: 5 },
    },
  },

  advanced: {
    useSecureCookies: isProd,
    defaultCookieAttributes: { httpOnly: true, sameSite: "lax", secure: isProd },
  },

  hooks: {
    // zod validation of the full sign-up body (including the DB² fields).
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path !== "/sign-up/email") return;
      const parsed = signUpSchema.safeParse(ctx.body);
      if (!parsed.success) {
        throw new APIError("BAD_REQUEST", { message: parsed.error.issues[0]?.message ?? "Invalid input." });
      }
    }),
  },

  databaseHooks: {
    user: {
      create: {
        before: async (newUser) => {
          const isAdmin = ADMIN_EMAILS.has(newUser.email.toLowerCase());
          return {
            data: {
              ...newUser,
              role: isAdmin ? "admin" : "user",
              status: isAdmin || REGISTRATION_MODE === "open" ? "approved" : "pending",
            },
          };
        },
        after: async (created) => {
          const status = String(created.status ?? "pending");
          await sendEmail({
            to: LAB_NOTIFY_EMAIL,
            subject: `New DB² registration: ${created.name} (${status})`,
            text: [
              `A new DB² account was registered.`,
              ``,
              `Name:        ${created.name}`,
              `Email:       ${created.email}`,
              `Institution: ${String(created.institution ?? "")}`,
              `Status:      ${status}`,
              ``,
              `Why they want access:`,
              String(created.purpose ?? ""),
              ``,
              status === "pending" ? `Review it at ${siteUrl}/admin/users` : `No action needed.`,
            ].join("\n"),
          });
        },
      },
    },
    session: {
      create: {
        // The approval gate: pending/rejected users never receive a session.
        before: async (newSession) => {
          const row = await db.query.user.findFirst({
            where: eq(schema.user.id, newSession.userId),
            columns: { status: true },
          });
          if (!row) throw new APIError("UNAUTHORIZED", { message: "Account not found." });
          if (row.status === "pending") throw new APIError("FORBIDDEN", { message: BLOCKED_MESSAGES.pending });
          if (row.status === "rejected") throw new APIError("FORBIDDEN", { message: BLOCKED_MESSAGES.rejected });
        },
      },
    },
  },

  // Must stay last: lets server actions set auth cookies.
  plugins: [nextCookies()],
});

export type Session = typeof auth.$Infer.Session;
