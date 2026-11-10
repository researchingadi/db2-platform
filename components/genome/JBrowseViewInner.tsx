"use client";

import { useEffect, useState } from "react";
import { createViewState, JBrowseLinearGenomeView } from "@jbrowse/react-linear-genome-view";

export type JBrowseViewState = ReturnType<typeof createViewState>;

interface Props {
  assembly: object;
  tracks: object[];
  speciesKey: string;
  /** Called once the view state exists, so the parent can read/drive the view via its API. */
  onReady?: (state: JBrowseViewState) => void;
}

export default function JBrowseViewInner({ assembly, tracks, speciesKey, onReady }: Props) {
  const [state] = useState(() =>
    createViewState({
      assembly,
      tracks,
      defaultSession: {
        name: `DB² Session — ${speciesKey}`,
        view: {
          id: "linearGenomeView",
          type: "LinearGenomeView",
        },
      },
    })
  );

  useEffect(() => {
    onReady?.(state);
    // Run once per created state; onReady identity changes must not re-fire it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <div
      style={{
        width: "100%",
        height: "calc(100vh - 130px)",
        minHeight: "600px",
      }}
    >
      <JBrowseLinearGenomeView viewState={state} />
    </div>
  );
}
