"use client";

import dynamic from "next/dynamic";
import JBrowseLoader from "./JBrowseLoader";
import type { JBrowseViewState } from "./JBrowseViewInner";

const JBrowseViewInner = dynamic(() => import("./JBrowseViewInner"), {
  ssr: false,
  loading: () => <JBrowseLoader />,
});

export default function JBrowseWrapper({
  assembly,
  tracks,
  speciesKey,
  onReady,
}: {
  assembly: object;
  tracks: object[];
  speciesKey: string;
  onReady?: (state: JBrowseViewState) => void;
}) {
  return <JBrowseViewInner assembly={assembly} tracks={tracks} speciesKey={speciesKey} onReady={onReady} />;
}
