"use client";

import dynamic from "next/dynamic";

const JBrowseViewInner = dynamic(() => import("./JBrowseViewInner"), {
  ssr: false,
  loading: () => (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "center",
      height: "600px", background: "#0c1028", borderRadius: "8px",
      color: "#94a3b8", fontSize: "14px",
    }}>
      Loading genome browser...
    </div>
  ),
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
