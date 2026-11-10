/*
 * npm run email:test
 * Sends one test message to LAB_NOTIFY_EMAIL using the real settings in .env
 * (loaded the same way Next.js loads them). Prints success or the error;
 * never prints the SMTP password or full config.
 */
import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

async function main() {
  // Import after the env is loaded so lib/email.ts sees the SMTP_* variables.
  const { sendEmail, testEmail } = await import("../lib/email");

  const to = (process.env.LAB_NOTIFY_EMAIL ?? "").trim();
  if (!to) {
    console.error("✗ LAB_NOTIFY_EMAIL is not set in .env, so there is nowhere to send the test.");
    process.exit(1);
  }
  const host = (process.env.SMTP_HOST ?? "").trim();
  if (host) {
    const port = Number(process.env.SMTP_PORT) || 587;
    console.log(`Sending a test email to ${to} via ${host}:${port} (${port === 465 ? "TLS" : "STARTTLS"})…`);
  } else {
    console.log("SMTP_HOST is not set: the email will be printed to the console instead of sent.");
  }

  const result = await sendEmail({ to, ...testEmail() });
  if (result.ok) {
    console.log(result.via === "smtp" ? `✓ Sent. Check the inbox for ${to}.` : "✓ Printed to the console (no SMTP configured).");
    process.exit(0);
  }
  console.error(`✗ Failed: ${result.error}`);
  process.exit(1);
}

main().catch((err) => {
  console.error(`✗ Unexpected error: ${err instanceof Error ? err.message : String(err)}`);
  process.exit(1);
});
