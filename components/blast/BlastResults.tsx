"use client";

/*
 * Shared BLAST results view (hit table + expandable alignments).
 * Moved verbatim from app/blast/page.tsx so saved-job pages render stored
 * results exactly like a live search. All strings are rendered as React text.
 */

import { useState } from "react";

type Hsp = {
  score: number;
  evalue: number;
  identity: number;
  align_len: number;
  qseq: string;
  hseq: string;
  midline: string;
  query_from: number;
  query_to: number;
  hit_from: number;
  hit_to: number;
};

type Hit = {
  description: { title: string; accession: string; sciname?: string }[];
  hsps: Hsp[];
};

export const cardStyle: React.CSSProperties = {
  background: "#0c1028",
  border: "1px solid rgba(99,102,241,0.15)",
  borderRadius: "12px",
  padding: "20px",
};

type AlignBlock = {
  qStart: number;
  qEnd: number;
  qLine: string;
  mLine: string;
  hStart: number;
  hEnd: number;
  hLine: string;
};

function buildAlignmentBlocks(
  qseq: string,
  hseq: string,
  midline: string,
  qFrom: number,
  qTo: number,
  hFrom: number,
  hTo: number
): AlignBlock[] {
  const CHUNK = 60;
  const blocks: AlignBlock[] = [];
  const qDir = qTo >= qFrom ? 1 : -1;
  const hDir = hTo >= hFrom ? 1 : -1;
  let qPos = qFrom;
  let hPos = hFrom;

  for (let i = 0; i < qseq.length; i += CHUNK) {
    const qLine = qseq.slice(i, i + CHUNK);
    const hLine = hseq.slice(i, i + CHUNK);
    const mLine = midline.slice(i, i + CHUNK);
    const qNonGap = qLine.split("").filter((c) => c !== "-").length;
    const hNonGap = hLine.split("").filter((c) => c !== "-").length;
    const qStart = qPos;
    const hStart = hPos;
    const qEnd = qNonGap > 0 ? qPos + qDir * (qNonGap - 1) : qPos;
    const hEnd = hNonGap > 0 ? hPos + hDir * (hNonGap - 1) : hPos;
    blocks.push({ qStart, qEnd, qLine, mLine, hStart, hEnd, hLine });
    qPos = qEnd + (qNonGap > 0 ? qDir : 0);
    hPos = hEnd + (hNonGap > 0 ? hDir : 0);
  }
  return blocks;
}

function SeqLine({ line, midline }: { line: string; midline: string }) {
  return (
    <>
      {line.split("").map((ch, i) => {
        let color = "#ef4444";
        if (ch === "-") color = "#f59e0b";
        else if (midline[i] === "|") color = "#10b981";
        return (
          <span key={i} style={{ color }}>
            {ch}
          </span>
        );
      })}
    </>
  );
}

export default function BlastResults({
  results,
  program,
  database,
  rid,
  querySequence,
  onNewSearch,
}: {
  results: any;
  program: string;
  database: string;
  rid: string | null;
  querySequence: string;
  onNewSearch?: () => void;
}) {
  const [expandedHit, setExpandedHit] = useState<number | null>(null);
  const hits: Hit[] =
    results?.BlastOutput2?.[0]?.report?.results?.search?.hits || [];
  const queryLength =
    results?.BlastOutput2?.[0]?.report?.results?.search?.query_len ??
    querySequence.replace(/^>.*$/m, "").replace(/s/g, "").length;
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: "12px",
          marginBottom: "16px",
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "Syne, var(--font-sans)",
              fontWeight: 800,
              fontSize: "22px",
              color: "#f1f5f9",
            }}
          >
            {hits.length} hits found
          </div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "11px",
              color: "#475569",
              marginTop: "4px",
            }}
          >
            Program: {program} · Database: {database} · RID: {rid} · Query
            length: {queryLength} bp
          </div>
        </div>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <a
            href={`https://blast.ncbi.nlm.nih.gov/Blast.cgi?CMD=Get&RID=${rid}`}
            target="_blank"
            rel="noreferrer"
            style={{
              color: "#6366f1",
              fontSize: "12px",
              fontFamily: "var(--font-sans)",
              textDecoration: "none",
            }}
          >
            View on NCBI →
          </a>
          {onNewSearch && (
            <button
              onClick={onNewSearch}
              style={{
                background: "transparent",
                color: "#6366f1",
                border: "1px solid rgba(99,102,241,0.3)",
                borderRadius: "7px",
                padding: "7px 16px",
                fontSize: "12px",
                fontFamily: "var(--font-sans)",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              New search
            </button>
          )}
        </div>
      </div>

      {hits.length === 0 ? (
        <div style={{ ...cardStyle, textAlign: "center", padding: "48px" }}>
          <div
            style={{
              fontFamily: "Syne, var(--font-sans)",
              fontWeight: 700,
              fontSize: "18px",
              color: "#f1f5f9",
            }}
          >
            No significant hits found.
          </div>
          <div
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "13px",
              color: "#94a3b8",
              marginTop: "8px",
            }}
          >
            Try relaxing your E-value threshold or broadening the search
            scope beyond O. taurus.
          </div>
        </div>
      ) : (
        <div style={{ ...cardStyle, padding: 0, overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "13px",
                fontFamily: "var(--font-sans)",
              }}
            >
              <thead>
                <tr style={{ background: "rgba(99,102,241,0.07)" }}>
                  {[
                    "#",
                    "Description",
                    "Scientific Name",
                    "Score",
                    "E-value",
                    "Identity",
                    "Coverage",
                    "Accession",
                  ].map((col) => (
                    <th
                      key={col}
                      style={{
                        padding: "10px 14px",
                        textAlign: "left",
                        fontSize: "10.5px",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "1px",
                        color: "#475569",
                        borderBottom: "1px solid rgba(99,102,241,0.12)",
                      }}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {hits.map((hit, i) => {
                  const desc = hit.description?.[0];
                  const hsp = hit.hsps?.[0];
                  if (!hsp) return null;
                  const identityPct = Math.round(
                    (hsp.identity / hsp.align_len) * 100
                  );
                  const coveragePct = Math.round(
                    (Math.abs(hsp.query_to - hsp.query_from + 1) / queryLength) *
                      100
                  );
                  const isExpanded = expandedHit === i;
                  return (
                    <>
                      <tr
                        key={desc?.accession || i}
                        onClick={() =>
                          setExpandedHit(isExpanded ? null : i)
                        }
                        style={{
                          borderBottom: "1px solid rgba(255,255,255,0.04)",
                          cursor: "pointer",
                          background: isExpanded
                            ? "rgba(99,102,241,0.06)"
                            : "transparent",
                        }}
                        onMouseEnter={(e) => {
                          if (!isExpanded)
                            e.currentTarget.style.background =
                              "rgba(99,102,241,0.04)";
                        }}
                        onMouseLeave={(e) => {
                          if (!isExpanded)
                            e.currentTarget.style.background = "transparent";
                        }}
                      >
                        <td style={{ padding: "9px 14px", color: "#475569" }}>
                          {i + 1}
                        </td>
                        <td
                          style={{
                            padding: "9px 14px",
                            color: "#f1f5f9",
                            maxWidth: "260px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {desc?.title}
                        </td>
                        <td
                          style={{
                            padding: "9px 14px",
                            color: "#94a3b8",
                            fontStyle: "italic",
                          }}
                        >
                          {desc?.sciname || "—"}
                        </td>
                        <td
                          style={{
                            padding: "9px 14px",
                            color: "#94a3b8",
                            fontFamily: "var(--font-mono)",
                            fontSize: "12px",
                          }}
                        >
                          {hsp.score}
                        </td>
                        <td
                          style={{
                            padding: "9px 14px",
                            color: "#94a3b8",
                            fontFamily: "var(--font-mono)",
                            fontSize: "12px",
                          }}
                        >
                          {hsp.evalue}
                        </td>
                        <td
                          style={{
                            padding: "9px 14px",
                            color: "#10b981",
                            fontFamily: "var(--font-mono)",
                            fontSize: "12px",
                          }}
                        >
                          {identityPct}%
                        </td>
                        <td
                          style={{
                            padding: "9px 14px",
                            color: "#06b6d4",
                            fontFamily: "var(--font-mono)",
                            fontSize: "12px",
                          }}
                        >
                          {coveragePct}%
                        </td>
                        <td
                          style={{
                            padding: "9px 14px",
                            color: "#6366f1",
                            fontFamily: "var(--font-mono)",
                            fontSize: "11.5px",
                          }}
                        >
                          {desc?.accession}
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr>
                          <td colSpan={8} style={{ padding: 0 }}>
                            <AlignmentView hsp={hsp} />
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function AlignmentView({ hsp }: { hsp: Hsp }) {
  const blocks = buildAlignmentBlocks(
    hsp.qseq,
    hsp.hseq,
    hsp.midline,
    hsp.query_from,
    hsp.query_to,
    hsp.hit_from,
    hsp.hit_to
  );

  return (
    <div
      style={{
        background: "#06081a",
        padding: "16px",
        fontFamily: "var(--font-mono)",
        fontSize: "11px",
        color: "#94a3b8",
        borderTop: "1px solid rgba(99,102,241,0.1)",
      }}
    >
      {blocks.map((b, i) => (
        <div key={i} style={{ marginBottom: "10px", whiteSpace: "pre" }}>
          <div>
            Query {String(b.qStart).padEnd(8)}
            <SeqLine line={b.qLine} midline={b.mLine} /> {b.qEnd}
          </div>
          <div style={{ color: "#475569" }}>{"       ".padEnd(9)}{b.mLine}</div>
          <div>
            Sbjct {String(b.hStart).padEnd(8)}
            <SeqLine line={b.hLine} midline={b.mLine} /> {b.hEnd}
          </div>
        </div>
      ))}
    </div>
  );
}
