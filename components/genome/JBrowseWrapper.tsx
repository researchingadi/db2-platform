"use client";

import dynamic from "next/dynamic";
import JBrowseLoader from "./JBrowseLoader";

const JBrowseViewInner = dynamic(() => import("./JBrowseViewInner"), {
  ssr: false,
  loading: () => <JBrowseLoader />,
});

export default function JBrowseWrapper({
  assembly,
  tracks,
  speciesKey,
}: {
  assembly: object;
  tracks: object[];
  speciesKey: string;
}) {
  return <JBrowseViewInner assembly={assembly} tracks={tracks} speciesKey={speciesKey} />;
}
