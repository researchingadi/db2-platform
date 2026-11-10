import nodemailer, { type Transporter } from "nodemailer";

/*
 * Single entry point for all outgoing email, plus the message templates.
 *
 * - SMTP_HOST set   → sent through SMTP with nodemailer (SMTP_PORT, SMTP_USER,
 *                     SMTP_PASS, EMAIL_FROM). Port 465 = implicit TLS; any other
 *                     port must upgrade with STARTTLS.
 * - SMTP_HOST unset → printed to the server console (local development).
 *
 * sendEmail never throws: a failed email is logged on the server and the
 * request that triggered it (registration, approval, password reset) carries on.
 * SMTP settings and passwords are never logged or sent to the browser.
 */

export const SITE_NAME = "DB² Dung Beetle Database";

export type Email = {
  to: string;
  subject: string;
  text: string;
};

export type SendResult = { ok: true; via: "smtp" | "console" } | { ok: false; error: string };

// Built from escaped strings so no raw line-separator characters live in this file.
const LINE_BREAKS = new RegExp("[\r\n\u0085\u2028\u2029]+", "g");
const CONTROL_CHARS = new RegExp("[\u0000-\u001f\u007f]", "g");

/** Collapse newlines/control characters so user text can't inject mail headers. */
export function oneLine(value: unknown, max = 200): string {
  return String(value ?? "")
    .replace(LINE_BREAKS, " ")
    .replace(/\s+/g, " ") // tabs etc. become spaces before control chars are stripped
    .replace(CONTROL_CHARS, "")
    .trim()
    .slice(0, max);
}

function siteUrl(): string {
  return (process.env.BETTER_AUTH_URL ?? "http://localhost:3000").replace(/\/+$/, "");
}

// ── Transport ────────────────────────────────────────────────────────────

let cachedTransport: Transporter | null | undefined;

function smtpTransport(): Transporter | null {
  if (cachedTransport !== undefined) return cachedTransport;
  const host = (process.env.SMTP_HOST ?? "").trim();
  if (!host) return (cachedTransport = null);
  const port = Number(process.env.SMTP_PORT) || 587;
  const user = (process.env.SMTP_USER ?? "").trim();
  const pass = process.env.SMTP_PASS ?? "";
  cachedTransport = nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // implicit TLS on 465
    requireTLS: port !== 465, // otherwise insist on STARTTLS
    auth: user ? { user, pass } : undefined,
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 20_000,
  });
  return cachedTransport;
}

/** Short, credential-free description of an SMTP error for server logs. */
function describeError(err: unknown): string {
  if (!err || typeof err !== "object") return String(err);
  const e = err as { code?: string; responseCode?: number; command?: string; message?: string };
  const parts = [e.code, e.responseCode ? `SMTP ${e.responseCode}` : null, e.command ? `during ${e.command}` : null]
    .filter(Boolean)
    .join(", ");
  const msg = oneLine(e.message ?? "", 300);
  return parts ? `${parts}: ${msg}` : msg;
}

export async function sendEmail(email: Email): Promise<SendResult> {
  const to = oneLine(email.to, 254);
  const subject = oneLine(email.subject, 200);
  if (!to) {
    console.warn(`[email] Skipped "${subject}": no recipient address.`);
    return { ok: false, error: "no recipient" };
  }

  const transport = smtpTransport();
  if (!transport) {
    console.log(
      ["", "──────── [email] ────────", `To:      ${to}`, `Subject: ${subject}`, "", email.text, "─────────────────────────", ""].join(
        "\n",
      ),
    );
    return { ok: true, via: "console" };
  }

  const from = oneLine(process.env.EMAIL_FROM || process.env.SMTP_USER || "", 254);
  try {
    await transport.sendMail({ from, to, subject, text: email.text });
    console.log(`[email] Sent "${subject}" to ${to}`);
    return { ok: true, via: "smtp" };
  } catch (err) {
    const error = describeError(err);
    console.error(`[email] Failed to send "${subject}" to ${to}: ${error}`);
    return { ok: false, error };
  }
}

// ── Templates (plain text; no tracking, no one-click action links) ─────────

const signature = () => `\n\n— ${SITE_NAME}\n${siteUrl()}`;

export function registrationNoticeEmail(u: {
  name: string;
  email: string;
  institution?: string | null;
  purpose?: string | null;
  status: string;
}): Omit<Email, "to"> {
  const pending = u.status === "pending";
  return {
    subject: `New DB² account request: ${oneLine(u.name, 80)}`,
    text: [
      pending
        ? `Someone has asked for an account on ${SITE_NAME}.`
        : `A new account was created on ${SITE_NAME} (approved automatically).`,
      ``,
      `Name:        ${oneLine(u.name)}`,
      `Email:       ${oneLine(u.email)}`,
      `Institution: ${oneLine(u.institution ?? "") || "—"}`,
      ``,
      `Why they want access:`,
      (u.purpose ?? "").trim() || "—",
      ``,
      pending
        ? `To approve or reject this request, sign in and open:\n${siteUrl()}/admin/users`
        : `You can review all accounts at:\n${siteUrl()}/admin/users`,
    ].join("\n") + signature(),
  };
}

export function accountApprovedEmail(u: { name: string }): Omit<Email, "to"> {
  return {
    subject: `Your ${SITE_NAME} account is approved`,
    text:
      `Hi ${oneLine(u.name)},\n\nThe Davidson Lab has approved your ${SITE_NAME} account. You can now log in here:\n\n${siteUrl()}/login` +
      signature(),
  };
}

export function accountRejectedEmail(u: { name: string }): Omit<Email, "to"> {
  return {
    subject: `Your ${SITE_NAME} registration`,
    text:
      `Hi ${oneLine(u.name)},\n\nThank you for your interest in ${SITE_NAME}. Your registration was not approved.\n\n` +
      `If you think this is a mistake, contact dungbeetledatabase@gmail.com.` +
      signature(),
  };
}

export function passwordResetEmail(u: { name: string; url: string }): Omit<Email, "to"> {
  return {
    subject: `Reset your ${SITE_NAME} password`,
    text:
      `Hi ${oneLine(u.name)},\n\nSomeone asked to reset the password for your ${SITE_NAME} account. ` +
      `To choose a new password, open this link (it expires in 1 hour):\n\n${u.url}\n\n` +
      `If you didn't ask for this, you can ignore this email; your password won't change.` +
      signature(),
  };
}

export function verifyEmailEmail(u: { name: string; url: string }): Omit<Email, "to"> {
  return {
    subject: `Verify your email for ${SITE_NAME}`,
    text: `Hi ${oneLine(u.name)},\n\nPlease confirm your email address for your ${SITE_NAME} account:\n\n${u.url}` + signature(),
  };
}

export function testEmail(): Omit<Email, "to"> {
  return {
    subject: `${SITE_NAME}: test email`,
    text: `This is a test message from ${SITE_NAME} (npm run email:test).\nIf you can read this, outgoing email is working.` + signature(),
  };
}
