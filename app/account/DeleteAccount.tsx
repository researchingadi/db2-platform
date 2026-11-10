"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { authErrorMessage } from "@/lib/auth-utils";

export default function DeleteAccount() {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const intro = (
    <p className="auth-help" style={{ fontSize: "0.9rem" }}>
      This permanently deletes your account and everything stored with it. It can't be undone.
    </p>
  );

  if (!confirming) {
    return (
      <div className="auth-form">
        {intro}
        <div>
          <button type="button" className="arcade-btn" onClick={() => setConfirming(true)}>
            Delete my account
          </button>
        </div>
      </div>
    );
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setPending(true);
    setError(null);
    const { error } = await authClient.deleteUser({ password: String(form.get("password") ?? "") });
    if (error) {
      setPending(false);
      setError(authErrorMessage(error, "Could not delete your account. Check your password."));
      return;
    }
    router.replace("/login?deleted=1");
    router.refresh();
  }

  return (
    <form className="auth-form" onSubmit={onSubmit} style={{ maxWidth: "460px" }}>
      {intro}
      {error && <p role="alert" className="auth-alert auth-alert--error">{error}</p>}
      <div className="auth-field">
        <label className="auth-label" htmlFor="delete-password">Enter your password to confirm</label>
        <input className="auth-input" id="delete-password" name="password" type="password" autoComplete="current-password" required autoFocus />
      </div>
      <div style={{ display: "flex", gap: "0.9rem", flexWrap: "wrap" }}>
        <button type="submit" className="arcade-btn arcade-btn--cta" disabled={pending}>
          {pending ? "Deleting…" : "Permanently delete"}
        </button>
        <button
          type="button"
          className="arcade-btn"
          disabled={pending}
          onClick={() => {
            setConfirming(false);
            setError(null);
          }}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
