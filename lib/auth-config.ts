import { z } from "zod";

/* Server-side settings read from env. Safe to import from server components. */

export const REGISTRATION_MODE: "approval" | "open" =
  process.env.REGISTRATION_MODE === "open" ? "open" : "approval";

export const EMAIL_VERIFICATION_REQUIRED = process.env.EMAIL_VERIFICATION_REQUIRED === "true";

export const ADMIN_EMAILS = new Set(
  (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean),
);

export const LAB_NOTIFY_EMAIL = (process.env.LAB_NOTIFY_EMAIL ?? "").trim();

export const MIN_PASSWORD_LENGTH = 10;
export const MAX_PASSWORD_LENGTH = 128;

export const BLOCKED_MESSAGES = {
  pending: "Your account is waiting for lab approval.",
  rejected: "Your registration was not approved.",
} as const;

/* Server-side validation for the sign-up body (Better Auth validates its own core fields too). */
export const signUpSchema = z.object({
  name: z.string().trim().min(1, "Name is required.").max(100, "Name is too long."),
  email: z.string().trim().email("Enter a valid email address.").max(254),
  password: z
    .string()
    .min(MIN_PASSWORD_LENGTH, `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`)
    .max(MAX_PASSWORD_LENGTH, "Password is too long."),
  institution: z.string().trim().min(1, "Institution is required.").max(200, "Institution is too long."),
  purpose: z
    .string()
    .trim()
    .min(1, "Please tell us why you want an account.")
    .max(2000, "Please keep this under 2000 characters."),
});
