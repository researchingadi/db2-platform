"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { authErrorMessage } from "@/lib/auth-utils";

export default function ResetPasswordForm({
  token,
  minPasswordLength,
}: {
  token: string;
  minPasswordLength: number;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const newPassword = String(form.get("password") ?? "");
    if (newPassword.length < minPasswordLength) {
      setError(`Password must be at least ${minPasswordLength} characters.`);
      return;
    }
    if (newPassword !== String(form.get("confirm") ?? "")) {
      setError("The two passwords don't match.");
      return;
    }
    setPending(true);
    setError(null);
    const { error } = await authClient.resetPassword({ newPassword, token });
    if (error) {
      setPending(false);
      setError(authErrorMessage(error, "This reset link is invalid or has expired."));
      return;
    }
    router.replace("/login?reset=1");
  }

  return (
    <form className="auth-form" onSubmit={onSubmit}>
      {error && <p role="alert" className="auth-alert auth-alert--error">{error}</p>}
      <div className="auth-field">
        <label className="auth-label" htmlFor="password">New password</label>
        <input
          className="auth-input"
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={minPasswordLength}
          maxLength={128}
          aria-describedby="password-help"
        />
        <p id="password-help" className="auth-help">At least {minPasswordLength} characters.</p>
      </div>
      <div className="auth-field">
        <label className="auth-label" htmlFor="confirm">Confirm new password</label>
        <input
          className="auth-input"
          id="confirm"
          name="confirm"
          type="password"
          autoComplete="new-password"
          required
          minLength={minPasswordLength}
          maxLength={128}
        />
      </div>
      <div>
        <button type="submit" className="arcade-btn arcade-btn--cta" disabled={pending}>
          {pending ? "Saving…" : "Save new password"}
        </button>
      </div>
    </form>
  );
}
