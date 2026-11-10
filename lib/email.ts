/*
 * Single entry point for all outgoing email.
 *
 * No email provider is configured yet, so every message is printed to the
 * server console. To send real mail later, replace the body of `deliver()`
 * with a provider call (SMTP via nodemailer, Resend, Postmark, ...) and keep
 * the `sendEmail` signature unchanged; no callers need to change.
 */

export type Email = {
  to: string;
  subject: string;
  text: string;
};

async function deliver({ to, subject, text }: Email): Promise<void> {
  if (process.env.NODE_ENV === "production") {
    console.warn("[email] No email provider configured; printing instead of sending.");
  }
  console.log(
    [
      "",
      "──────── [email] ────────",
      `To:      ${to}`,
      `Subject: ${subject}`,
      "",
      text,
      "─────────────────────────",
      "",
    ].join("\n"),
  );
}

export async function sendEmail(email: Email): Promise<void> {
  if (!email.to) {
    console.warn(`[email] Skipped "${email.subject}": no recipient address.`);
    return;
  }
  try {
    await deliver(email);
  } catch (err) {
    // Never let an email failure break sign-up, approval or password reset.
    console.error("[email] Failed to send:", err);
  }
}
