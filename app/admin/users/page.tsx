import { desc } from "drizzle-orm";
import PageShell from "@/components/site/PageShell";
import { db, schema } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { decideUser } from "./actions";

export const metadata = { title: "Users — DB² admin", robots: { index: false } };

const STATUS_COLOR = {
  approved: "var(--db-green)",
  pending: "var(--db-violet)",
  rejected: "var(--arcade-pink)",
} as const;

const dateFmt = new Intl.DateTimeFormat("en-US", { year: "numeric", month: "short", day: "numeric" });

export default async function AdminUsersPage() {
  // Server-side gate: anyone who isn't an approved admin gets a 404.
  await requireAdmin();

  // Explicit columns only: no tokens or password hashes (those live in other tables anyway).
  const users = await db
    .select({
      id: schema.user.id,
      name: schema.user.name,
      email: schema.user.email,
      institution: schema.user.institution,
      purpose: schema.user.purpose,
      status: schema.user.status,
      role: schema.user.role,
      createdAt: schema.user.createdAt,
    })
    .from(schema.user)
    .orderBy(desc(schema.user.createdAt));

  const pendingCount = users.filter((u) => u.status === "pending").length;

  return (
    <PageShell>
      <div style={{ maxWidth: "1540px", margin: "0 auto", padding: "4rem 1.25rem 6rem" }}>
        <p className="db-eyebrow">DB² · Admin</p>
        <h1 className="arcade-title" style={{ fontSize: "clamp(1.3rem, 3vw, 1.9rem)" }}>
          Users
        </h1>
        <p
          style={{
            marginTop: "1rem",
            fontFamily: "var(--font-sans)",
            fontSize: "0.95rem",
            color: "var(--db-stone)",
          }}
        >
          {users.length} {users.length === 1 ? "account" : "accounts"} · {pendingCount} waiting for approval
        </p>

        <div style={{ marginTop: "2rem" }}>
          <table className="contact-table">
            <caption className="sr-only">Registered users with status and approval actions</caption>
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Email</th>
                <th scope="col">Institution</th>
                <th scope="col">Purpose</th>
                <th scope="col">Status</th>
                <th scope="col">Created</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 && (
                <tr className="person-row">
                  <td colSpan={7}>No accounts yet.</td>
                </tr>
              )}
              {users.map((u) => (
                <tr key={u.id} className="person-row">
                  <th scope="row" data-label="Name">
                    {u.name}
                    {u.role === "admin" ? " (admin)" : ""}
                  </th>
                  <td data-label="Email">{u.email}</td>
                  <td data-label="Institution">{u.institution || "—"}</td>
                  <td data-label="Purpose" style={{ maxWidth: "28rem", whiteSpace: "pre-wrap" }}>
                    {u.purpose || "—"}
                  </td>
                  <td data-label="Status" style={{ color: STATUS_COLOR[u.status], textTransform: "capitalize" }}>
                    {u.status}
                  </td>
                  <td data-label="Created" style={{ whiteSpace: "nowrap" }}>{dateFmt.format(u.createdAt)}</td>
                  <td data-label="Actions">
                    {u.status === "pending" ? (
                      <form action={decideUser} style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
                        <input type="hidden" name="userId" value={u.id} />
                        <button
                          type="submit"
                          name="decision"
                          value="approve"
                          className="arcade-btn arcade-btn--small"
                          aria-label={`Approve ${u.name}`}
                        >
                          Approve
                        </button>
                        <button
                          type="submit"
                          name="decision"
                          value="reject"
                          className="arcade-btn arcade-btn--small"
                          aria-label={`Reject ${u.name}`}
                        >
                          Reject
                        </button>
                      </form>
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PageShell>
  );
}
