"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { authErrorMessage } from "@/lib/auth-utils";

export default function LoginForm({
  next,
  notice,
}: {
  next: string;
  notice: { kind: "success" | "error" | "info"; text: string } | null;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setPending(true);
    setError(null);
    const { error } = await authClient.signIn.email({
      email: String(form.get("email") ?? ""),
      password: String(form.get("password") ?? ""),
    });
    if (error) {
      setError(authErrorMessage(error, "Incorrect email or password."));
      setPending(false);
      return;
    }
    router.replace(next);
    router.refresh();
  }

  return (
    <form className="auth-form" onSubmit={onSubmit} noValidate={false}>
      {notice && !error && (
        <p
          role="status"
          className={`auth-alert ${notice.kind === "error" ? "auth-alert--error" : notice.kind === "success" ? "auth-alert--success" : ""}`}
        >
          {notice.text}
        </p>
      )}
      {error && (
        <p role="alert" className="auth-alert auth-alert--error">
          {error}
        </p>
      )}

      <div className="auth-field">
        <label className="auth-label" htmlFor="email">Email</label>
        <input className="auth-input" id="email" name="email" type="email" autoComplete="email" required />
      </div>
      <div className="auth-field">
        <label className="auth-label" htmlFor="password">Password</label>
        <input
          className="auth-input"
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
      </div>

      <div>
        <button type="submit" className="arcade-btn arcade-btn--cta" disabled={pending}>
          {pending ? "Logging in…" : "Log in"}
        </button>
      </div>

      <div className="auth-links">
        <Link href="/forgot-password">Forgot your password?</Link>
        <Link href="/register">Create an account</Link>
      </div>
    </form>
  );
}
