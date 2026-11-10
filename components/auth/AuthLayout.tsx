import PageShell from "@/components/site/PageShell";

/* Shared frame for /login, /register, /forgot-password, /reset-password. */
export default function AuthLayout({
  eyebrow,
  title,
  barLabel,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  barLabel: string;
  intro?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <PageShell>
      <div style={{ maxWidth: "560px", margin: "0 auto", padding: "4rem 1.25rem 6rem" }}>
        <p className="db-eyebrow">{eyebrow}</p>
        <h1 className="arcade-title" style={{ fontSize: "clamp(1.3rem, 3vw, 1.9rem)" }}>
          {title}
        </h1>
        {intro && (
          <div
            style={{
              marginTop: "1rem",
              fontFamily: "var(--font-sans)",
              fontSize: "0.95rem",
              lineHeight: 1.65,
              color: "var(--db-stone)",
            }}
          >
            {intro}
          </div>
        )}
        <section className="arcade-panel" style={{ marginTop: "2rem" }} aria-label={barLabel}>
          <div className="arcade-panel__bar" aria-hidden="true">
            <span>{barLabel}</span>
          </div>
          <div style={{ padding: "1.5rem" }}>{children}</div>
        </section>
      </div>
    </PageShell>
  );
}
