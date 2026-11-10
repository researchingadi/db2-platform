"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export type ViewRow = {
  id: string;
  kind: "bookmark" | "session";
  label: string;
  note: string | null;
  speciesId: string;
  speciesName: string;
  locus: string;
  trackCount: number;
  createdAt: string;
};

const dateFmt = new Intl.DateTimeFormat("en-US", { year: "numeric", month: "short", day: "numeric" });
const MAX_LABEL = 120;
const MAX_NOTE = 500;

const linkBtn: React.CSSProperties = {
  background: "none",
  border: 0,
  padding: 0,
  font: "inherit",
  color: "var(--db-cyan)",
  textDecoration: "underline",
  textUnderlineOffset: "3px",
  cursor: "pointer",
};
const smallInput: React.CSSProperties = { width: "100%", minWidth: 0, padding: "0.45rem 0.6rem", fontSize: "0.85rem" };

function Row({ v }: { v: ViewRow }) {
  const router = useRouter();
  const [mode, setMode] = useState<"view" | "edit" | "confirm-delete">("view");
  const [label, setLabel] = useState(v.label);
  const [note, setNote] = useState(v.note ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const openHref = `/genome-browser/${v.speciesId}?view=${v.id}`;

  async function call(method: "PATCH" | "DELETE", body?: unknown) {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/saved-views/${v.id}`, {
        method,
        headers: body ? { "Content-Type": "application/json" } : undefined,
        body: body ? JSON.stringify(body) : undefined,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.error || "Something went wrong.");
        return false;
      }
      router.refresh();
      return true;
    } catch {
      setError("Could not reach the server.");
      return false;
    } finally {
      setBusy(false);
    }
  }

  return (
    <tr className="person-row">
      <th scope="row" data-label="Label" style={{ minWidth: "12rem" }}>
        {mode === "edit" ? (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (await call("PATCH", { label, note })) setMode("view");
            }}
            style={{ display: "grid", gap: "0.5rem" }}
          >
            <label htmlFor={`label-${v.id}`} className="sr-only">Label</label>
            <input
              id={`label-${v.id}`}
              className="auth-input"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              maxLength={MAX_LABEL}
              required
              autoFocus
              style={smallInput}
            />
            <label htmlFor={`note-${v.id}`} className="sr-only">Note</label>
            <textarea
              id={`note-${v.id}`}
              className="auth-input"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              maxLength={MAX_NOTE}
              placeholder="Note (optional)"
              style={{ ...smallInput, minHeight: "3.5rem" }}
            />
            <span style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              <button type="submit" className="arcade-btn arcade-btn--small" disabled={busy}>
                Save
              </button>
              <button
                type="button"
                className="arcade-btn arcade-btn--small"
                disabled={busy}
                onClick={() => {
                  setLabel(v.label);
                  setNote(v.note ?? "");
                  setMode("view");
                  setError(null);
                }}
              >
                Cancel
              </button>
            </span>
          </form>
        ) : (
          <>
            <Link href={openHref}>{v.label}</Link>
            {v.note && (
              <span
                style={{
                  display: "block",
                  marginTop: "0.3rem",
                  fontSize: "0.82rem",
                  color: "var(--db-stone)",
                  whiteSpace: "pre-wrap",
                  overflowWrap: "anywhere",
                }}
              >
                {v.note}
              </span>
            )}
          </>
        )}
        {error && (
          <span role="alert" style={{ display: "block", marginTop: "0.35rem", color: "var(--arcade-pink)", fontSize: "0.8rem" }}>
            {error}
          </span>
        )}
      </th>
      <td data-label="Species">
        <em>{v.speciesName}</em>
      </td>
      <td data-label="Locus" style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", overflowWrap: "anywhere" }}>
        {v.locus}
      </td>
      <td data-label="Kind" style={{ textTransform: "capitalize" }}>{v.kind}</td>
      <td data-label="Tracks">{v.kind === "session" ? v.trackCount : "—"}</td>
      <td data-label="Date" style={{ whiteSpace: "nowrap" }}>{dateFmt.format(new Date(v.createdAt))}</td>
      <td data-label="Actions">
        {mode === "confirm-delete" ? (
          <span style={{ display: "inline-flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>
            <span>Delete?</span>
            <button
              type="button"
              style={{ ...linkBtn, color: "var(--arcade-pink)" }}
              disabled={busy}
              onClick={() => call("DELETE")}
              aria-label={`Confirm delete ${v.label}`}
            >
              Yes, delete
            </button>
            <button type="button" style={linkBtn} disabled={busy} onClick={() => setMode("view")}>
              Cancel
            </button>
          </span>
        ) : (
          <span style={{ display: "inline-flex", gap: "0.9rem", flexWrap: "wrap" }}>
            <Link href={openHref} aria-label={`Open ${v.label}`}>
              Open
            </Link>
            <button type="button" style={linkBtn} onClick={() => setMode("edit")} aria-label={`Edit ${v.label}`}>
              Rename / note
            </button>
            <button type="button" style={linkBtn} onClick={() => setMode("confirm-delete")} aria-label={`Delete ${v.label}`}>
              Delete
            </button>
          </span>
        )}
      </td>
    </tr>
  );
}

export default function ViewsTable({ views }: { views: ViewRow[] }) {
  return (
    <table className="contact-table">
      <caption className="sr-only">Your saved genome browser views</caption>
      <thead>
        <tr>
          <th scope="col">Label</th>
          <th scope="col">Species</th>
          <th scope="col">Locus</th>
          <th scope="col">Kind</th>
          <th scope="col">Tracks</th>
          <th scope="col">Date</th>
          <th scope="col">Actions</th>
        </tr>
      </thead>
      <tbody>
        {views.map((v) => (
          <Row key={v.id} v={v} />
        ))}
      </tbody>
    </table>
  );
}
