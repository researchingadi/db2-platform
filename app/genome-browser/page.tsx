import JBrowseWrapper from "@/components/genome/JBrowseWrapper";
import { DB2_ASSEMBLY, DB2_TRACKS } from "@/lib/jbrowse-config";

export default function GenomeBrowserPage() {
  return (
    <main style={{ padding: "24px", background: "#06081a", minHeight: "100vh" }}>
      <h1 style={{ marginBottom: "16px", fontSize: "24px", fontWeight: "bold", color: "#f1f5f9" }}>
        Genome Browser — Onthophagus taurus v3.2
      </h1>
      <JBrowseWrapper assembly={DB2_ASSEMBLY} tracks={DB2_TRACKS} />
    </main>
  );
}