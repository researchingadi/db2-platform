"use client";

import Link from "next/link";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

const MAX_LABEL = 120;

function defaultLabel(program: string, query: string) {
  return `${program} · ${query.replace(/\s+/g, " ").trim().slice(0, 30)}`.slice(0, MAX_LABEL);
}

// Arcade panel (4px cream border, hard shadow, no radius).
const wrap: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: "0.75rem 1rem",
  marginBottom: "24px",
  padding: "16px 18px",
  border: "var(--arcade-border) solid var(--db-cream)",
  borderRadius: 0,
  boxShadow: "var(--arcade-shadow)",
  background: "var(--db-charcoal)",
  fontFamily: "var(--font-sans)",
  fontSize: "15px",
  color: "var(--db-stone)",
};

const link: React.CSSProperties = { color: "var(--db-cyan)", textDecoration: "underline", textUnderlineOffset: "3px" };

// The form's existing label, styled as the panel's title bar.
const barLabel: React.CSSProperties = {
  flexBasis: "calc(100% + 36px)",
  margin: "-16px -18px 4px",
};

type Props = {
  rid: string | null;
  program: string;
  database: string;
  entrezQuery: string;
  evalue: number;
  hitlistSize: number;
  querySequence: string;
  results: unknown;
  /** Called just before the logged-out "Log in" link navigates away (the page stashes its state). */
  onLoginClick?: () => void;
};

/* "Save this search" panel shown above BLAST results. */
export default function SaveSearch(props: Props) {
  const { data, isPending } = authClient.useSession();
  const [label, setLabel] = useState(() => defaultLabel(props.program, props.querySequence));
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [message, setMessage] = useState("");

  if (isPending || !props.rid) return null;
  const user = data?.user;

  if (!user) {
    return (
      <div style={wrap} data-save-search>
        <Link href="/login?next=%2Fblast" style={link} onClick={() => props.onLoginClick?.()}>
          Log in to save this search
        </Link>
      </div>
    );
  }

  if (user.status !== "approved") {
    return (
      <div style={wrap} data-save-search>
        <span>Saving is available once your account is approved.</span>
      </div>
    );
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setState("saving");
    setMessage("");
    try {
      const res = await fetch("/api/saved-blast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          label: label.trim() || undefined,
          rid: props.rid,
          program: props.program,
          database: props.database,
          entrezQuery: props.entrezQuery,
          evalue: props.evalue,
          hitlistSize: props.hitlistSize,
          querySequence: props.querySequence,
          results: props.results,
        }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setState("error");
        setMessage(body?.error || "Could not save this search.");
        return;
      }
      setState("saved");
      setMessage(body?.updated ? "Saved (updated)" : "Saved");
    } catch {
      setState("error");
      setMessage("Could not reach the server.");
    }
  }

  return (
    <form style={wrap} onSubmit={save} data-save-search aria-label="Save this search">
      <label htmlFor="save-label" className="arcade-panel__bar" style={barLabel}>
        Save this search
      </label>
      <input
        id="save-label"
        className="arcade-input"
        value={label}
        onChange={(e) => {
          setLabel(e.target.value);
          if (state === "saved") setState("idle");
        }}
        maxLength={MAX_LABEL}
        aria-describedby="save-status"
        style={{ flex: "1 1 260px", width: "auto", minWidth: 0, fontFamily: "var(--font-sans)" }}
      />
      <button type="submit" className="arcade-btn" disabled={state === "saving"}>
        {state === "saving" ? "Saving…" : "Save"}
      </button>
      <span id="save-status" role="status" style={{ flexBasis: "100%", minHeight: "1.2em" }}>
        {state === "saved" && (
          <>
            <span style={{ color: "var(--db-green)" }}>{message}</span>
            {" · "}
            <Link href="/account/blast-jobs" style={link}>
              View saved searches
            </Link>
          </>
        )}
        {state === "error" && <span style={{ color: "var(--arcade-pink)" }}>{message}</span>}
      </span>
    </form>
  );
}
