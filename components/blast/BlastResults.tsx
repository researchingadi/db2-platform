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

/* Arcade panel look shared by the BLAST page's cards. */
export const cardStyle: React.CSSProperties = {
  background: "var(--db-charcoal)",
  border: "var(--arcade-border) solid var(--db-cream)",
  borderRadius: 0,
  boxShadow: "var(--arcade-shadow)",
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
        // mismatch = pink, gap = violet, identical = green
        let color = "var(--arcade-pink)";
        if (ch === "-") color = "var(--db-violet)";
        else if (midline[i] === "|") color = "var(--db-green)";
        return (
          <span key={i} style={{ color }}>
            {ch}
          </span>
        );
      })}
    </>
  );
}

const monoCell: React.CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: "14px",
  whiteSpace: "nowrap",
};

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
    querySequence.replace(/^>.*$/m, "").replace(/\s/g, "").length;
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: "16px",
          marginBottom: "20px",
        }}
      >
        <div style={{ minWidth: 0 }}>
          <div
            className="arcade-title"
            style={{
              fontSize: "clamp(1rem, 2.2vw, 1.3rem)",
            }}
          >
            {hits.length} hits found
          </div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "14px",
              lineHeight: 1.6,
              color: "var(--db-stone)",
              marginTop: "10px",
              overflowWrap: "anywhere",
            }}
          >
            Program: {program} · Database: {database} · RID: {rid} · Query
            length: {queryLength} bp
          </div>
        </div>
        <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
          <a
            href={`https://blast.ncbi.nlm.nih.gov/Blast.cgi?CMD=Get&RID=${rid}`}
            target="_blank"
            rel="noreferrer"
            className="arcade-btn arcade-btn--small pixel-glyphs"
          >
            View on NCBI →
          </a>
          {onNewSearch && (
            <button
              onClick={onNewSearch}
              className="arcade-btn arcade-btn--small"
            >
              New search
            </button>
          )}
        </div>
      </div>

      {hits.length === 0 ? (
        <div style={{ ...cardStyle, textAlign: "center", padding: "0 24px 32px" }}>
          <div
            className="arcade-panel__bar"
            style={{
              margin: "0 -24px 24px",
              justifyContent: "center",
            }}
          >
            No significant hits found.
          </div>
          <div
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "15px",
              lineHeight: 1.6,
              color: "var(--db-stone)",
            }}
          >
            Try relaxing your E-value threshold or broadening the search
            scope beyond O. taurus.
          </div>
        </div>
      ) : (
        <div style={{ ...cardStyle, padding: 0, overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table className="blast-table">
              <thead>
                <tr>
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
                    <th key={col}>{col}</th>
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
                          cursor: "pointer",
                          background: isExpanded
                            ? "var(--db-panel-2)"
                            : "transparent",
                          boxShadow: isExpanded ? "inset 4px 0 0 var(--db-cyan)" : "none",
                        }}
                        onMouseEnter={(e) => {
                          if (!isExpanded)
                            e.currentTarget.style.background =
                              "var(--db-panel-2)";
                        }}
                        onMouseLeave={(e) => {
                          if (!isExpanded)
                            e.currentTarget.style.background = "transparent";
                        }}
                      >
                        <td style={{ ...monoCell, color: "var(--db-stone)" }}>
                          {i + 1}
                        </td>
                        <td
                          style={{
                            color: "var(--db-cream)",
                            maxWidth: "320px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {desc?.title}
                        </td>
                        <td
                          style={{
                            color: "var(--db-stone)",
                            fontStyle: "italic",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {desc?.sciname || "—"}
                        </td>
                        <td style={{ ...monoCell, color: "var(--db-cream)" }}>
                          {hsp.score}
                        </td>
                        <td style={{ ...monoCell, color: "var(--db-cream)" }}>
                          {hsp.evalue}
                        </td>
                        <td style={{ ...monoCell, color: "var(--db-green)" }}>
                          {identityPct}%
                        </td>
                        <td style={{ ...monoCell, color: "var(--db-cyan)" }}>
                          {coveragePct}%
                        </td>
                        <td style={{ ...monoCell, color: "var(--db-cyan)" }}>
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
        background: "var(--db-black)",
        padding: "18px 20px",
        fontFamily: "var(--font-mono)",
        fontSize: "14px",
        lineHeight: 1.55,
        color: "var(--db-cream)",
        borderTop: "2px dashed var(--db-line-strong)",
        borderBottom: "2px dashed var(--db-line-strong)",
      }}
    >
      {blocks.map((b, i) => (
        <div key={i} style={{ marginBottom: "12px", whiteSpace: "pre" }}>
          <div>
            Query {String(b.qStart).padEnd(8)}
            <SeqLine line={b.qLine} midline={b.mLine} /> {b.qEnd}
          </div>
          <div style={{ color: "var(--db-stone)" }}>{"       ".padEnd(9)}{b.mLine}</div>
          <div>
            Sbjct {String(b.hStart).padEnd(8)}
            <SeqLine line={b.hLine} midline={b.mLine} /> {b.hEnd}
          </div>
        </div>
      ))}
    </div>
  );
}
