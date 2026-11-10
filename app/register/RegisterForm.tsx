"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { authErrorMessage } from "@/lib/auth-utils";

type Done = { text: string; showLogin: boolean };

export default function RegisterForm({
  approval,
  verificationRequired,
  minPasswordLength,
}: {
  approval: boolean;
  verificationRequired: boolean;
  minPasswordLength: number;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState<Done | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const password = String(form.get("password") ?? "");
    if (password.length < minPasswordLength) {
      setError(`Password must be at least ${minPasswordLength} characters.`);
      return;
    }
    setPending(true);
    setError(null);
    const { data, error } = await authClient.signUp.email({
      name: String(form.get("name") ?? ""),
      email: String(form.get("email") ?? ""),
      password,
      institution: String(form.get("institution") ?? ""),
      purpose: String(form.get("purpose") ?? ""),
      callbackURL: "/login?verified=1",
    });
    setPending(false);
    if (error) {
      setError(authErrorMessage(error, "Registration failed. Please check the form and try again."));
      return;
    }
    // Signed straight in (open mode, no verification): go to the account page.
    if (data && "token" in data && data.token) {
      router.replace("/account");
      router.refresh();
      return;
    }
    const approved = data?.user?.status === "approved";
    const parts: string[] = [];
    if (verificationRequired) parts.push("Check your email for a link to verify your address.");
    if (approved) parts.push(verificationRequired ? "After that you can log in." : "Your account is ready. You can log in now.");
    else if (approval)
      parts.push("Your registration was received. The Davidson Lab will review it, and you'll get an email when your account is approved.");
    setDone({ text: parts.join(" "), showLogin: approved });
  }

  if (done) {
    return (
      <div className="auth-form">
        <p role="status" className="auth-alert auth-alert--success">{done.text}</p>
        {done.showLogin && (
          <div>
            <Link href="/login" className="arcade-btn arcade-btn--cta">Log in</Link>
          </div>
        )}
      </div>
    );
  }

  return (
    <form className="auth-form" onSubmit={onSubmit}>
      {error && (
        <p role="alert" className="auth-alert auth-alert--error">{error}</p>
      )}

      <div className="auth-field">
        <label className="auth-label" htmlFor="name">Name</label>
        <input className="auth-input" id="name" name="name" autoComplete="name" required maxLength={100} />
      </div>
      <div className="auth-field">
        <label className="auth-label" htmlFor="email">Email</label>
        <input className="auth-input" id="email" name="email" type="email" autoComplete="email" required maxLength={254} />
      </div>
      <div className="auth-field">
        <label className="auth-label" htmlFor="password">Password</label>
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
        <label className="auth-label" htmlFor="institution">Institution</label>
        <input className="auth-input" id="institution" name="institution" autoComplete="organization" required maxLength={200} />
      </div>
      <div className="auth-field">
        <label className="auth-label" htmlFor="purpose">Why do you want an account?</label>
        <textarea className="auth-input" id="purpose" name="purpose" required maxLength={2000} />
      </div>

      <div>
        <button type="submit" className="arcade-btn arcade-btn--cta" disabled={pending}>
          {pending ? "Submitting…" : "Create account"}
        </button>
      </div>

      <div className="auth-links">
        <Link href="/login">Already have an account? Log in</Link>
      </div>
    </form>
  );
}
