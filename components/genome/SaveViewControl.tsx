"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { authClient } from "@/lib/auth-client";

export type CurrentView = { locus: string | null; trackIds: string[] };

const MAX_LABEL = 120;
const MAX_NOTE = 500;

const ctrl: React.CSSProperties = {
  fontFamily: "var(--font-sans)",
  fontSize: "12px",
  lineHeight: 1.4,
  whiteSpace: "nowrap",
};
const btn: React.CSSProperties = {
  ...ctrl,
  padding: "3px 12px",
  border: "1px solid var(--db-line-strong)",
  background: "transparent",
  color: "var(--db-cream)",
  cursor: "pointer",
};
const link: React.CSSProperties = { ...ctrl, color: "var(--db-cyan)", textDecoration: "underline", textUnderlineOffset: "3px" };
const label: React.CSSProperties = { fontFamily: "var(--font-sans)", fontSize: "0.8rem", fontWeight: 600, color: "var(--db-cream)" };

/*
 * "Save view" control for the species bar. Kept to one short line so the bar
 * never grows; the form lives in a popover that overlays the page.
 */
export default function SaveViewControl({
  speciesId,
  speciesName,
  readView,
}: {
  speciesId: string;
  speciesName: string;
  readView: () => CurrentView;
}) {
  const router = useRouter();
  const { data, isPending } = authClient.useSession();
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<CurrentView>({ locus: null, trackIds: [] });
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [withTracks, setWithTracks] = useState(true);
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [message, setMessage] = useState("");
  const wrapRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (isPending) return null;
  const user = data?.user;

  if (!user) {
    return (
      <span style={{ marginLeft: "auto", display: "inline-flex" }}>
        <a
          href="/login"
          style={link}
          onClick={(e) => {
            e.preventDefault();
            const { locus } = readView();
            const back = `/genome-browser/${speciesId}${locus ? `?loc=${encodeURIComponent(locus)}` : ""}`;
            router.push(`/login?next=${encodeURIComponent(back)}`);
          }}
        >
          Log in to save views
        </a>
      </span>
    );
  }

  function openPopover() {
    const v = readView(); // read the view at click time
    setCurrent(v);
    setTitle(v.locus ? `${speciesName} · ${v.locus}`.slice(0, MAX_LABEL) : "");
    setNote("");
    setWithTracks(v.trackIds.length > 0);
    setState("idle");
    setMessage("");
    setOpen(true);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!current.locus) return;
    setState("saving");
    setMessage("");
    try {
      const res = await fetch("/api/saved-views", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: withTracks ? "session" : "bookmark",
          label: title.trim() || undefined,
          note: note.trim() || null,
          speciesId,
          locus: current.locus,
          trackIds: withTracks ? current.trackIds : [],
        }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setState("error");
        setMessage(body?.error || "Could not save this view.");
        return;
      }
      setState("saved");
    } catch {
      setState("error");
      setMessage("Could not reach the server.");
    }
  }

  const approved = user.status === "approved";

  return (
    <span
      ref={wrapRef}
      style={{
        // Negative vertical margins: the bordered button (24.8px) takes up only
        // 16.8px of line height, the same as the bar's text, so the bar never grows
        // (it would otherwise add ~9px on narrow screens where this shares a text-only line).
        margin: "-4px 0 -4px auto",
        display: "inline-flex",
        alignItems: "center",
        gap: "12px",
        position: "relative",
      }}
    >
      <button
        type="button"
        style={btn}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => (open ? setOpen(false) : openPopover())}
      >
        Save view
      </button>
      <Link href="/account/saved-views" style={link}>
        My views
      </Link>

      {open && (
        <div
          role="dialog"
          aria-label="Save this view"
          style={{
            position: "absolute",
            top: "calc(100% + 10px)",
            right: 0,
            zIndex: 75,
            width: "min(340px, calc(100vw - 32px))",
            padding: "1rem",
            border: "var(--arcade-border) solid var(--db-cream)",
            background: "var(--db-black)",
            boxShadow: "var(--arcade-shadow)",
            display: "grid",
            gap: "0.75rem",
            whiteSpace: "normal",
          }}
        >
          {!approved ? (
            <p className="auth-help" style={{ fontSize: "0.85rem" }}>
              Saving is available once your account is approved.
            </p>
          ) : !current.locus ? (
            <p className="auth-help" style={{ fontSize: "0.85rem" }}>
              Open a location in the browser first (for example, type a region and press Open), then save it.
            </p>
          ) : state === "saved" ? (
            <p role="status" className="auth-help" style={{ fontSize: "0.85rem" }}>
              <span style={{ color: "var(--db-green)" }}>Saved</span> ·{" "}
              <Link href="/account/saved-views" className="auth-inline-link">
                View saved views
              </Link>
            </p>
          ) : (
            <form onSubmit={save} style={{ display: "grid", gap: "0.75rem" }}>
              <p className="auth-help" style={{ fontSize: "0.8rem", overflowWrap: "anywhere" }}>
                Location: <span style={{ color: "var(--db-cream)", fontFamily: "var(--font-mono)" }}>{current.locus}</span>
              </p>
              <div className="auth-field">
                <label htmlFor="sv-label" style={label}>Label</label>
                <input
                  id="sv-label"
                  className="auth-input"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={MAX_LABEL}
                  style={{ padding: "0.5rem 0.6rem", fontSize: "0.85rem" }}
                />
              </div>
              <div className="auth-field">
                <label htmlFor="sv-note" style={label}>Note (optional)</label>
                <textarea
                  id="sv-note"
                  className="auth-input"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  maxLength={MAX_NOTE}
                  style={{ minHeight: "4rem", padding: "0.5rem 0.6rem", fontSize: "0.85rem" }}
                />
              </div>
              <label style={{ ...label, fontWeight: 400, display: "flex", gap: "0.5rem", alignItems: "flex-start", color: "var(--db-stone)" }}>
                <input
                  type="checkbox"
                  checked={withTracks}
                  onChange={(e) => setWithTracks(e.target.checked)}
                  style={{ marginTop: "0.2rem" }}
                />
                <span>
                  Also save which tracks are open ({current.trackIds.length} open)
                </span>
              </label>
              {state === "error" && (
                <p role="alert" className="auth-help" style={{ color: "var(--arcade-pink)", fontSize: "0.85rem" }}>
                  {message}
                </p>
              )}
              <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                <button type="submit" className="arcade-btn arcade-btn--small" disabled={state === "saving"}>
                  {state === "saving" ? "Saving…" : "Save"}
                </button>
                <button type="button" className="arcade-btn arcade-btn--small" onClick={() => setOpen(false)}>
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </span>
  );
}
