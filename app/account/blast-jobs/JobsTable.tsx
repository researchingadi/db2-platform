"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export type JobRow = {
  id: string;
  label: string;
  program: string;
  database: string;
  numHits: number;
  bestHitTitle: string | null;
  bestEvalue: string | null;
  createdAt: string;
};

const dateFmt = new Intl.DateTimeFormat("en-US", { year: "numeric", month: "short", day: "numeric" });
const MAX_LABEL = 120;

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

function Row({ job }: { job: JobRow }) {
  const router = useRouter();
  const [mode, setMode] = useState<"view" | "rename" | "confirm-delete">("view");
  const [label, setLabel] = useState(job.label);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function call(method: "PATCH" | "DELETE", body?: unknown) {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/saved-blast/${job.id}`, {
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
        {mode === "rename" ? (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (await call("PATCH", { label })) setMode("view");
            }}
            style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center" }}
          >
            <label htmlFor={`label-${job.id}`} className="sr-only">
              New label
            </label>
            <input
              id={`label-${job.id}`}
              className="auth-input"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              maxLength={MAX_LABEL}
              required
              autoFocus
              style={{ flex: "1 1 10rem", width: "auto", minWidth: 0, padding: "0.45rem 0.6rem", fontSize: "0.85rem" }}
            />
            <button type="submit" className="arcade-btn arcade-btn--small" disabled={busy}>
              Save
            </button>
            <button
              type="button"
              className="arcade-btn arcade-btn--small"
              disabled={busy}
              onClick={() => {
                setLabel(job.label);
                setMode("view");
                setError(null);
              }}
            >
              Cancel
            </button>
          </form>
        ) : (
          <Link href={`/account/blast-jobs/${job.id}`}>{job.label}</Link>
        )}
        {error && (
          <span role="alert" style={{ display: "block", marginTop: "0.35rem", color: "var(--arcade-pink)", fontSize: "0.8rem" }}>
            {error}
          </span>
        )}
      </th>
      <td data-label="Program">{job.program}</td>
      <td data-label="Database">{job.database}</td>
      <td data-label="Date" style={{ whiteSpace: "nowrap" }}>{dateFmt.format(new Date(job.createdAt))}</td>
      <td data-label="Hits">{job.numHits}</td>
      <td data-label="Best hit" style={{ maxWidth: "22rem", overflowWrap: "anywhere" }}>
        {job.bestHitTitle || "—"}
      </td>
      <td data-label="E-value" style={{ whiteSpace: "nowrap" }}>{job.bestEvalue ?? "—"}</td>
      <td data-label="Actions">
        {mode === "confirm-delete" ? (
          <span style={{ display: "inline-flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>
            <span>Delete?</span>
            <button
              type="button"
              style={{ ...linkBtn, color: "var(--arcade-pink)" }}
              disabled={busy}
              onClick={() => call("DELETE")}
              aria-label={`Confirm delete ${job.label}`}
            >
              Yes, delete
            </button>
            <button type="button" style={linkBtn} disabled={busy} onClick={() => setMode("view")}>
              Cancel
            </button>
          </span>
        ) : (
          <span style={{ display: "inline-flex", gap: "0.9rem", flexWrap: "wrap" }}>
            <Link href={`/account/blast-jobs/${job.id}`} aria-label={`Open ${job.label}`}>
              Open
            </Link>
            <button type="button" style={linkBtn} onClick={() => setMode("rename")} aria-label={`Rename ${job.label}`}>
              Rename
            </button>
            <button
              type="button"
              style={linkBtn}
              onClick={() => setMode("confirm-delete")}
              aria-label={`Delete ${job.label}`}
            >
              Delete
            </button>
          </span>
        )}
      </td>
    </tr>
  );
}

export default function JobsTable({ jobs }: { jobs: JobRow[] }) {
  return (
    <table className="contact-table">
      <caption className="sr-only">Your saved BLAST searches</caption>
      <thead>
        <tr>
          <th scope="col">Label</th>
          <th scope="col">Program</th>
          <th scope="col">Database</th>
          <th scope="col">Date</th>
          <th scope="col">Hits</th>
          <th scope="col">Best hit</th>
          <th scope="col">E-value</th>
          <th scope="col">Actions</th>
        </tr>
      </thead>
      <tbody>
        {jobs.map((job) => (
          <Row key={job.id} job={job} />
        ))}
      </tbody>
    </table>
  );
}
