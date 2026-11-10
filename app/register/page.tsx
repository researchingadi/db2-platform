import { redirect } from "next/navigation";
import AuthLayout from "@/components/auth/AuthLayout";
import { EMAIL_VERIFICATION_REQUIRED, MIN_PASSWORD_LENGTH, REGISTRATION_MODE } from "@/lib/auth-config";
import { getCurrentUser } from "@/lib/session";
import RegisterForm from "./RegisterForm";

export const metadata = { title: "Create an account — DB²" };

export default async function RegisterPage() {
  const current = await getCurrentUser();
  if (current?.status === "approved") redirect("/account");

  const approval = REGISTRATION_MODE === "approval";

  return (
    <AuthLayout
      eyebrow="DB² · Account"
      title="Create an account"
      barLabel="Register"
      intro={
        <>
          {approval && <p style={{ margin: "0 0 0.4rem" }}>New accounts are reviewed by the Davidson Lab before access is granted.</p>}
          <p style={{ margin: 0 }}>We store only the information on this form.</p>
        </>
      }
    >
      <RegisterForm
        approval={approval}
        verificationRequired={EMAIL_VERIFICATION_REQUIRED}
        minPasswordLength={MIN_PASSWORD_LENGTH}
      />
    </AuthLayout>
  );
}
