import Link from "next/link";
import AuthLayout from "@/components/auth/AuthLayout";
import { MIN_PASSWORD_LENGTH } from "@/lib/auth-config";
import ResetPasswordForm from "./ResetPasswordForm";

export const metadata = { title: "Choose a new password — DB²" };

type SP = { [key: string]: string | string[] | undefined };
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export default function ResetPasswordPage({ searchParams }: { searchParams: SP }) {
  const token = one(searchParams.token);
  const invalid = !token || Boolean(one(searchParams.error));

  return (
    <AuthLayout eyebrow="DB² · Account" title="Choose a new password" barLabel="New password">
      {invalid ? (
        <div className="auth-form">
          <p role="alert" className="auth-alert auth-alert--error">
            This reset link is invalid or has expired.
          </p>
          <div className="auth-links">
            <Link href="/forgot-password">Request a new link</Link>
          </div>
        </div>
      ) : (
        <ResetPasswordForm token={token} minPasswordLength={MIN_PASSWORD_LENGTH} />
      )}
    </AuthLayout>
  );
}
