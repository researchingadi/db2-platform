import { redirect } from "next/navigation";
import AuthLayout from "@/components/auth/AuthLayout";
import { BLOCKED_MESSAGES } from "@/lib/auth-config";
import { safeNext } from "@/lib/auth-utils";
import { getCurrentUser } from "@/lib/session";
import LoginForm from "./LoginForm";

export const metadata = { title: "Log in — DB²" };

type SP = { [key: string]: string | string[] | undefined };
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export default async function LoginPage({ searchParams }: { searchParams: SP }) {
  const next = safeNext(one(searchParams.next));
  const current = await getCurrentUser();
  if (current?.status === "approved") redirect(next);

  const blocked = one(searchParams.blocked);
  let notice: { kind: "success" | "error" | "info"; text: string } | null = null;
  if (blocked === "pending" || blocked === "rejected") notice = { kind: "error", text: BLOCKED_MESSAGES[blocked] };
  else if (one(searchParams.verified)) notice = { kind: "success", text: "Your email is verified. You can log in now." };
  else if (one(searchParams.reset)) notice = { kind: "success", text: "Your password was changed. Log in with your new password." };
  else if (one(searchParams.deleted)) notice = { kind: "info", text: "Your account was deleted." };

  return (
    <AuthLayout eyebrow="DB² · Account" title="Log in" barLabel="Log in">
      <LoginForm next={next} notice={notice} />
    </AuthLayout>
  );
}
