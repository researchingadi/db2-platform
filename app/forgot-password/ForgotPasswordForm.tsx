"use client";

import Link from "next/link";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { authErrorMessage } from "@/lib/auth-utils";

export default function ForgotPasswordForm() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setPending(true);
    setError(null);
    const { error } = await authClient.requestPasswordReset({
      email: String(form.get("email") ?? ""),
      redirectTo: "/reset-password",
    });
    setPending(false);
    // Same message whether or not the account exists, so emails can't be probed.
    if (error && error.status === 429) {
      setError(authErrorMessage(error));
      return;
    }
    setSent(true);
  }

  if (sent) {
    return (
      <div className="auth-form">
        <p role="status" className="auth-alert auth-alert--success">
          If an account exists for that email, we've sent a link to reset your password.
        </p>
        <div className="auth-links">
          <Link href="/login">Back to log in</Link>
        </div>
      </div>
    );
  }

  return (
    <form className="auth-form" onSubmit={onSubmit}>
      {error && <p role="alert" className="auth-alert auth-alert--error">{error}</p>}
      <div className="auth-field">
        <label className="auth-label" htmlFor="email">Email</label>
        <input className="auth-input" id="email" name="email" type="email" autoComplete="email" required />
      </div>
      <div>
        <button type="submit" className="arcade-btn arcade-btn--cta" disabled={pending}>
          {pending ? "Sending…" : "Send reset link"}
        </button>
      </div>
      <div className="auth-links">
        <Link href="/login">Back to log in</Link>
      </div>
    </form>
  );
}
