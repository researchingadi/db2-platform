import PageShell from "@/components/site/PageShell";
import { MIN_PASSWORD_LENGTH } from "@/lib/auth-config";
import { requireApprovedUser } from "@/lib/session";
import ChangePasswordForm from "./ChangePasswordForm";
import DeleteAccount from "./DeleteAccount";

export const metadata = { title: "Your account — DB²" };

const STATUS_COLOR = {
  approved: "var(--db-green)",
  pending: "var(--db-violet)",
  rejected: "var(--arcade-pink)",
} as const;

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  const id = `h-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  return (
    <section className="arcade-panel" aria-labelledby={id}>
      <h2 id={id} className="arcade-panel__bar">
        {title}
      </h2>
      <div style={{ padding: "1.5rem" }}>{children}</div>
    </section>
  );
}

const dtStyle: React.CSSProperties = {
  fontFamily: "var(--font-sans)",
  fontSize: "0.8rem",
  fontWeight: 600,
  color: "var(--db-stone)",
};
const ddStyle: React.CSSProperties = {
  margin: 0,
  fontFamily: "var(--font-sans)",
  fontSize: "0.95rem",
  color: "var(--db-cream)",
  overflowWrap: "anywhere",
};
const comingSoon: React.CSSProperties = {
  margin: 0,
  fontFamily: "var(--font-sans)",
  fontSize: "0.9rem",
  color: "var(--db-stone)",
};

export default async function AccountPage() {
  // Server-side gate: redirects to /login if logged out, or if not approved.
  const user = await requireApprovedUser("/account");

  return (
    <PageShell>
      <div style={{ maxWidth: "980px", margin: "0 auto", padding: "4rem 1.25rem 6rem" }}>
        <p className="db-eyebrow">DB² · Account</p>
        <h1 className="arcade-title" style={{ fontSize: "clamp(1.3rem, 3vw, 1.9rem)" }}>
          Your account
        </h1>

        <div style={{ display: "grid", gap: "2rem", marginTop: "2.5rem" }}>
          <Panel title="Profile">
            <dl
              style={{
                margin: 0,
                display: "grid",
                gridTemplateColumns: "minmax(7rem, max-content) 1fr",
                gap: "0.8rem 1.5rem",
                alignItems: "baseline",
              }}
            >
              <dt style={dtStyle}>Name</dt>
              <dd style={ddStyle}>{user.name}</dd>
              <dt style={dtStyle}>Email</dt>
              <dd style={ddStyle}>{user.email}</dd>
              <dt style={dtStyle}>Institution</dt>
              <dd style={ddStyle}>{user.institution || "—"}</dd>
              <dt style={dtStyle}>Status</dt>
              <dd style={{ ...ddStyle, color: STATUS_COLOR[user.status], textTransform: "capitalize" }}>
                {user.status}
                {user.role === "admin" ? " · admin" : ""}
              </dd>
            </dl>
          </Panel>

          <Panel title="Change password">
            <ChangePasswordForm minPasswordLength={MIN_PASSWORD_LENGTH} />
          </Panel>

          <Panel title="Saved BLAST jobs">
            <p style={comingSoon}>Coming soon.</p>
          </Panel>

          <Panel title="Bookmarks & saved sessions">
            <p style={comingSoon}>Coming soon.</p>
          </Panel>

          <Panel title="Delete my account">
            <DeleteAccount />
          </Panel>
        </div>
      </div>
    </PageShell>
  );
}
