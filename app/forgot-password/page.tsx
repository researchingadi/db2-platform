import AuthLayout from "@/components/auth/AuthLayout";
import ForgotPasswordForm from "./ForgotPasswordForm";

export const metadata = { title: "Forgot password — DB²" };

export default function ForgotPasswordPage() {
  return (
    <AuthLayout
      eyebrow="DB² · Account"
      title="Forgot password"
      barLabel="Reset password"
      intro={<p style={{ margin: 0 }}>Enter your email and we'll send you a link to choose a new password.</p>}
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
