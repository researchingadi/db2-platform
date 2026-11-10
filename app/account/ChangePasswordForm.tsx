"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { authErrorMessage } from "@/lib/auth-utils";

export default function ChangePasswordForm({ minPasswordLength }: { minPasswordLength: number }) {
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formEl = e.currentTarget;
    const form = new FormData(formEl);
    const newPassword = String(form.get("newPassword") ?? "");
    setOk(false);
    if (newPassword.length < minPasswordLength) {
      setError(`New password must be at least ${minPasswordLength} characters.`);
      return;
    }
    if (newPassword !== String(form.get("confirm") ?? "")) {
      setError("The two new passwords don't match.");
      return;
    }
    setPending(true);
    setError(null);
    const { error } = await authClient.changePassword({
      currentPassword: String(form.get("currentPassword") ?? ""),
      newPassword,
      revokeOtherSessions: true,
    });
    setPending(false);
    if (error) {
      setError(authErrorMessage(error, "Could not change your password."));
      return;
    }
    formEl.reset();
    setOk(true);
  }

  return (
    <form className="auth-form" onSubmit={onSubmit} style={{ maxWidth: "460px" }}>
      {error && <p role="alert" className="auth-alert auth-alert--error">{error}</p>}
      {ok && (
        <p role="status" className="auth-alert auth-alert--success">
          Password changed. You've been logged out on your other devices.
        </p>
      )}
      <div className="auth-field">
        <label className="auth-label" htmlFor="currentPassword">Current password</label>
        <input className="auth-input" id="currentPassword" name="currentPassword" type="password" autoComplete="current-password" required />
      </div>
      <div className="auth-field">
        <label className="auth-label" htmlFor="newPassword">New password</label>
        <input
          className="auth-input"
          id="newPassword"
          name="newPassword"
          type="password"
          autoComplete="new-password"
          required
          minLength={minPasswordLength}
          maxLength={128}
          aria-describedby="new-password-help"
        />
        <p id="new-password-help" className="auth-help">At least {minPasswordLength} characters.</p>
      </div>
      <div className="auth-field">
        <label className="auth-label" htmlFor="confirm">Confirm new password</label>
        <input className="auth-input" id="confirm" name="confirm" type="password" autoComplete="new-password" required minLength={minPasswordLength} maxLength={128} />
      </div>
      <div>
        <button type="submit" className="arcade-btn" disabled={pending}>
          {pending ? "Saving…" : "Change password"}
        </button>
      </div>
    </form>
  );
}
