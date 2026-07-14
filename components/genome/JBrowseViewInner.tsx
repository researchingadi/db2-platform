"use client";

import { useState } from "react";
import { createViewState, JBrowseLinearGenomeView } from "@jbrowse/react-linear-genome-view";

interface Props {
  assembly: object;
  tracks: object[];
  speciesKey: string;
}

export default function JBrowseViewInner({ assembly, tracks, speciesKey }: Props) {
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

  return (
    <div key={speciesKey} style={{ width: "100%" }}>
      <JBrowseLinearGenomeView viewState={state} />
    </div>
  );
}
