"use client";

import { useState } from "react";
import { createViewState, JBrowseLinearGenomeView } from "@jbrowse/react-linear-genome-view";

interface Props {
  assembly: object;
  tracks: object[];
}

export default function JBrowseViewInner({ assembly, tracks }: Props) {
  const [state] = useState(() =>
    createViewState({
      assembly,
      tracks,
      defaultSession: {
        name: "DB² Session",
        view: {
          id: "linearGenomeView",
          type: "LinearGenomeView",
        },
      },
      location: "chr1:1..1000000",
    })
  );

  return (
    <div style={{ width: "100%" }}>
      <JBrowseLinearGenomeView viewState={state} />
    </div>
  );
}