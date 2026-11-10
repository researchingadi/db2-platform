"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import JBrowseWrapper from "@/components/genome/JBrowseWrapper";
import type { JBrowseViewState } from "@/components/genome/JBrowseViewInner";
import SaveViewControl, { type CurrentView } from "@/components/genome/SaveViewControl";
import { SPECIES_LIST, SPECIES_CONFIGS } from "@/lib/jbrowse-config";
import { normalizeLocus } from "@/lib/locus";

/* Minimal shape of the JBrowse LinearGenomeView API we use (verified against 2.18 types). */
type LgvView = {
  initialized: boolean;
  coarseVisibleLocStrings: string;
  tracks: { configuration?: { trackId?: unknown } }[];
  navToLocString: (input: string, optAssemblyName?: string) => Promise<void>;
  showTrack: (trackId: string) => unknown;
};

export default function SpeciesBrowser({ speciesId }: { speciesId: string }) {
  const species = SPECIES_LIST.find((s) => s.id === speciesId)!;
  const config = SPECIES_CONFIGS[speciesId];
  const router = useRouter();
  const stateRef = useRef<JBrowseViewState | null>(null);
  const handledRef = useRef<JBrowseViewState | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const getView = () => (stateRef.current?.session?.view as unknown as LgvView | undefined) ?? null;

  // Current location (first visible region) and open track IDs, read on demand.
  const readView = useCallback((): CurrentView => {
    const view = getView();
    if (!view || !view.initialized) return { locus: null, trackIds: [] };
    const first = (view.coarseVisibleLocStrings || "").trim().split(/\s+/)[0];
    const trackIds = view.tracks
      .map((t) => t.configuration?.trackId)
      .filter((id): id is string => typeof id === "string");
    return { locus: normalizeLocus(first), trackIds: [...new Set(trackIds)] };
  }, []);

  // Once JBrowse exists: apply ?view=<id> (saved view) or ?loc=<locus> through the view API.
  const onReady = useCallback(
    async (state: JBrowseViewState) => {
      stateRef.current = state;
      if (handledRef.current === state) return; // React dev double-invoke guard
      handledRef.current = state;
      const view = getView();
      if (!view) return;
      const params = new URLSearchParams(window.location.search);
      const viewId = params.get("view");
      const loc = params.get("loc");
      const assemblyName = species.assemblyName;

      if (viewId) {
        let res: Response;
        try {
          res = await fetch(`/api/saved-views/${encodeURIComponent(viewId)}`);
        } catch {
          setNotice("Couldn't load that saved view. Showing the default view.");
          return;
        }
        if (!res.ok) {
          setNotice(
            res.status === 401
              ? "Log in to open your saved views. Showing the default view."
              : res.status === 403
                ? "Saved views are available once your account is approved."
                : "That saved view isn't available (it may have been deleted). Showing the default view.",
          );
          return;
        }
        const saved = (await res.json())?.view as
          | { speciesId: string; locus: string; trackIds: string[] }
          | undefined;
        if (!saved) return;
        if (saved.speciesId !== speciesId) {
          if (SPECIES_LIST.some((s) => s.id === saved.speciesId)) {
            router.replace(`/genome-browser/${saved.speciesId}?view=${encodeURIComponent(viewId)}`);
          }
          return;
        }
        const locus = normalizeLocus(saved.locus);
        if (!locus) return;
        try {
          await view.navToLocString(locus, assemblyName);
          for (const id of saved.trackIds ?? []) {
            try {
              view.showTrack(id);
            } catch {
              /* a track that no longer exists is skipped */
            }
          }
        } catch {
          setNotice(`Couldn't open ${locus} in this assembly. Showing the default view.`);
        }
        return;
      }

      if (loc) {
        const locus = normalizeLocus(loc);
        if (!locus) {
          setNotice("That location link isn't valid. Use refname:start-end.");
          return;
        }
        try {
          await view.navToLocString(locus, assemblyName);
        } catch {
          setNotice(`Couldn't open ${locus} in this assembly.`);
        }
      }
    },
    [router, speciesId, species.assemblyName],
  );

  return (
    <>
      <div
        style={{
          background: "#0c1028",
          borderBottom: "1px solid rgba(99,102,241,0.15)",
          padding: "10px 20px",
          display: "flex",
          alignItems: "center",
          gap: "16px",
          flexWrap: "wrap",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "12px",
            color: "#475569",
          }}
        >
          Species:
        </span>
        {SPECIES_LIST.map((s) => {
          const active = s.id === speciesId;
          return (
            <Link
              key={s.id}
              href={`/genome-browser/${s.id}`}
              style={{
                padding: "6px 14px",
                borderRadius: "999px",
                border: active ? "none" : "1px solid rgba(99,102,241,0.2)",
                background: active ? "#6366f1" : "rgba(99,102,241,0.08)",
                color: active ? "#ffffff" : "#94a3b8",
                fontFamily: "var(--font-sans)",
                fontSize: "13px",
                fontStyle: "italic",
                textDecoration: "none",
                lineHeight: 1.4,
              }}
            >
              {s.scientificName}
            </Link>
          );
        })}
        <span style={{ color: "#475569" }}> · </span>
        <span
          style={{
            fontFamily: "var(--font-sans)",
            fontStyle: "italic",
            fontSize: "12px",
            color: "#64748b",
          }}
        >
          {species.scientificName}
        </span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "#64748b" }}>
          {species.assemblyName}
        </span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "#64748b" }}>
          {species.genomeSize}
        </span>
        <SaveViewControl speciesId={speciesId} speciesName={species.scientificName} readView={readView} />
      </div>

      <div
        style={{
          width: "100%",
          height: "calc(100vh - 130px)",
          overflow: "visible",
          position: "relative",
        }}
      >
        <JBrowseWrapper
          key={speciesId}
          assembly={config.assembly}
          tracks={config.tracks}
          speciesKey={speciesId}
          onReady={onReady}
        />
      </div>

      {/* Non-blocking notice (fixed, so it never changes the layout). */}
      {notice && (
        <div
          role="status"
          style={{
            position: "fixed",
            left: "16px",
            bottom: "16px",
            zIndex: 75,
            maxWidth: "min(420px, calc(100vw - 32px))",
            display: "flex",
            gap: "0.75rem",
            alignItems: "flex-start",
            padding: "0.75rem 0.9rem",
            border: "2px solid var(--db-cream)",
            background: "var(--db-black)",
            boxShadow: "var(--arcade-shadow)",
            fontFamily: "var(--font-sans)",
            fontSize: "0.85rem",
            color: "var(--db-cream)",
          }}
        >
          <span style={{ flex: 1 }}>{notice}</span>
          <button
            type="button"
            onClick={() => setNotice(null)}
            aria-label="Dismiss"
            style={{ background: "none", border: 0, color: "var(--db-stone)", cursor: "pointer", fontSize: "1rem", lineHeight: 1 }}
          >
            ×
          </button>
        </div>
      )}
    </>
  );
}
