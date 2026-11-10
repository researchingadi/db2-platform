"use client";

import { useState, useEffect, useMemo } from "react";
import PageShell from "@/components/site/PageShell";

type DatasetRow = Record<string, string>;

const ROWS_PER_PAGE = 25;

const STRATEGY_COLORS: Record<string, { bg: string; color: string }> = {
  WGS: { bg: "var(--db-black)", color: "var(--db-cyan)" },
  "RNA-Seq": { bg: "var(--db-black)", color: "var(--db-green)" },
  "Targeted-Capture": { bg: "var(--db-black)", color: "var(--db-violet)" },
  "RAD-Seq": { bg: "var(--db-black)", color: "var(--db-cream)" },
  "Hi-C": { bg: "var(--db-black)", color: "var(--db-stone)" },
};
const STRATEGY_FALLBACK = { bg: "var(--db-black)", color: "var(--db-stone)" };

const SOURCE_COLORS: Record<string, { bg: string; color: string }> = {
  GENOMIC: { bg: "var(--db-black)", color: "var(--db-cyan)" },
  TRANSCRIPTOMIC: { bg: "var(--db-black)", color: "var(--db-green)" },
};
const SOURCE_FALLBACK = { bg: "var(--db-black)", color: "var(--db-stone)" };

function Pill({ label, colors }: { label: string; colors: { bg: string; color: string } }) {
  return (
    <span
      style={{
        display: "inline-block",
        background: colors.bg,
        color: colors.color,
        border: `2px solid ${colors.color}`,
        padding: "1px 7px",
        fontFamily: "var(--font-mono)",
        fontSize: "14px",
        fontWeight: 600,
        lineHeight: 1.4,
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
}

function truncate(str: string, len: number) {
  return str.length > len ? str.slice(0, len).trim() + "…" : str;
}

export default function DatasetsPage() {
  const [data, setData] = useState<DatasetRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSpecies, setFilterSpecies] = useState("");
  const [filterStrategy, setFilterStrategy] = useState("");
  const [filterSource, setFilterSource] = useState("");
  const [filterStudy, setFilterStudy] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetch("/api/datasets")
      .then((res) => res.json())
      .then((rows: DatasetRow[]) => {
        setData(rows);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const uniqueSpecies = useMemo(
    () => Array.from(new Set(data.map((r) => r["Species"]))).filter(Boolean).sort(),
    [data]
  );
  const uniqueStrategies = useMemo(
    () => Array.from(new Set(data.map((r) => r["Library Strategy"]))).filter(Boolean).sort(),
    [data]
  );
  const uniqueSources = useMemo(
    () => Array.from(new Set(data.map((r) => r["Library Source"]))).filter(Boolean).sort(),
    [data]
  );
  const uniqueStudies = useMemo(
    () => Array.from(new Set(data.map((r) => r["Study Title"]))).filter(Boolean).sort(),
    [data]
  );

  const filteredData = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return data.filter((row) => {
      if (filterSpecies && row["Species"] !== filterSpecies) return false;
      if (filterStrategy && row["Library Strategy"] !== filterStrategy) return false;
      if (filterSource && row["Library Source"] !== filterSource) return false;
      if (filterStudy && row["Study Title"] !== filterStudy) return false;
      if (q) {
        const matches = Object.values(row).some((v) => v.toLowerCase().includes(q));
        if (!matches) return false;
      }
      return true;
    });
  }, [data, searchQuery, filterSpecies, filterStrategy, filterSource, filterStudy]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterSpecies, filterStrategy, filterSource, filterStudy]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / ROWS_PER_PAGE));
  const pagedData = filteredData.slice(
    (currentPage - 1) * ROWS_PER_PAGE,
    currentPage * ROWS_PER_PAGE
  );

  const hasActiveFilters =
    !!searchQuery || !!filterSpecies || !!filterStrategy || !!filterSource || !!filterStudy;

  function clearFilters() {
    setSearchQuery("");
    setFilterSpecies("");
    setFilterStrategy("");
    setFilterSource("");
    setFilterStudy("");
  }

  const selectStyle: React.CSSProperties = {
    padding: "9px 12px",
    color: "var(--db-cream)",
    fontFamily: "var(--font-sans)",
    fontSize: "14px",
    cursor: "pointer",
    width: "auto",
    maxWidth: "100%",
  };

  const start = filteredData.length === 0 ? 0 : (currentPage - 1) * ROWS_PER_PAGE + 1;
  const end = Math.min(currentPage * ROWS_PER_PAGE, filteredData.length);

  const pageNumbers = useMemo(() => {
    const nums: (number | "…")[] = [];
    const maxShown = 5;
    if (totalPages <= maxShown) {
      for (let i = 1; i <= totalPages; i++) nums.push(i);
      return nums;
    }
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + maxShown - 1);
    startPage = Math.max(1, endPage - maxShown + 1);

    if (startPage > 1) {
      nums.push(1);
      if (startPage > 2) nums.push("…");
    }
    for (let i = startPage; i <= endPage; i++) nums.push(i);
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) nums.push("…");
      nums.push(totalPages);
    }
    return nums;
  }, [totalPages, currentPage]);

  function pageButtonStyle(active: boolean, disabled: boolean): React.CSSProperties {
    return {
      background: active ? "var(--db-cyan)" : "var(--db-black)",
      border: `2px solid ${active ? "var(--db-cyan)" : "var(--db-cream)"}`,
      color: active ? "var(--db-black)" : "var(--db-cream)",
      boxShadow: "3px 3px 0 var(--db-black)",
      padding: "0.55rem 0.7rem",
      fontSize: "0.6rem",
      lineHeight: 1.4,
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.45 : 1,
      fontFamily: '"Arcade Glyphs", var(--font-pixel)',
      minWidth: "40px",
    };
  }

  return (
    <PageShell>
      <div style={{ background: "var(--db-black)", minHeight: "100vh" }}>
        <div style={{ maxWidth: "1300px", margin: "0 auto", padding: "40px 16px 64px" }}>
          {/* ── Header ── */}
          <div style={{ marginBottom: "28px" }}>
            <p className="db-eyebrow" style={{ margin: 0 }}>
              SCARABAEINAE · NCBI SRA
            </p>
            <h1
              className="arcade-title"
              style={{
                fontSize: "clamp(1.3rem, 3vw, 1.9rem)",
                lineHeight: 1.3,
                margin: "12px 0 0",
              }}
            >
              Genomic Datasets
            </h1>
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "15px",
                lineHeight: 1.6,
                color: "var(--db-stone)",
                maxWidth: "640px",
                marginTop: "14px",
              }}
            >
              Genomic and transcriptomic datasets for Scarabaeinae (dung beetles)
              available in NCBI SRA. Includes whole-genome sequencing, RNA-seq,
              targeted capture, RAD-seq, and Hi-C datasets across {data.length}{" "}
              entries.
            </p>
          </div>

          {/* ── Search and filter bar ── */}
          <div
            className="arcade-panel"
            style={{
              padding: "16px",
              marginBottom: "24px",
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search species, title, institution, accession..."
              className="arcade-input"
              style={{
                flex: 1,
                minWidth: "min(220px, 100%)",
                padding: "9px 12px",
                fontFamily: "var(--font-sans)",
                fontSize: "15px",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "var(--db-cyan)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "var(--db-cream)")}
            />

            <select
              value={filterSpecies}
              onChange={(e) => setFilterSpecies(e.target.value)}
              className="arcade-input"
              style={selectStyle}
            >
              <option value="">All Species</option>
              {uniqueSpecies.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            <select
              value={filterStrategy}
              onChange={(e) => setFilterStrategy(e.target.value)}
              className="arcade-input"
              style={selectStyle}
            >
              <option value="">All Strategies</option>
              {uniqueStrategies.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            <select
              value={filterSource}
              onChange={(e) => setFilterSource(e.target.value)}
              className="arcade-input"
              style={selectStyle}
            >
              <option value="">All Sources</option>
              {uniqueSources.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            <select
              value={filterStudy}
              onChange={(e) => setFilterStudy(e.target.value)}
              className="arcade-input"
              style={selectStyle}
            >
              <option value="">All Studies</option>
              {uniqueStudies.map((s) => (
                <option key={s} value={s}>
                  {truncate(s, 40)}
                </option>
              ))}
            </select>

            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "14px",
                color: "var(--db-stone)",
                whiteSpace: "nowrap",
                marginLeft: "auto",
              }}
            >
              {filteredData.length} datasets
            </span>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="arcade-btn arcade-btn--small"
              >
                Clear filters ×
              </button>
            )}
          </div>

          {/* ── Data table ── */}
          <div
            className="arcade-panel"
            style={{
              padding: 0,
              overflow: "hidden",
            }}
          >
            {loading ? (
              <div
                style={{
                  textAlign: "center",
                  color: "var(--db-cream)",
                  padding: "60px 16px",
                  fontFamily: "var(--font-pixel)",
                  fontSize: "0.65rem",
                  lineHeight: 1.6,
                  textTransform: "uppercase",
                }}
              >
                <span className="blink" style={{ display: "inline-block", width: "10px", height: "10px", background: "var(--db-cyan)", marginRight: "12px" }} />
                Loading datasets...
              </div>
            ) : filteredData.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  color: "var(--db-stone)",
                  padding: "48px 16px",
                  fontFamily: "var(--font-sans)",
                  fontSize: "15px",
                }}
              >
                No datasets match your search.
              </div>
            ) : (
              <>
                <div style={{ overflowX: "auto" }}>
                  <table className="blast-table" style={{ minWidth: "980px" }}>
                    <thead>
                      <tr>
                        {[
                          "Species",
                          "Title",
                          "Institution",
                          "Library Strategy",
                          "Library Source",
                          "Size (Mb)",
                          "Accession",
                        ].map((col) => (
                          <th key={col}>
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {pagedData.map((row, i) => (
                        <tr
                          key={row["Accession"] || i}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.background = "var(--db-panel-2)")
                          }
                          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                        >
                          <td
                            style={{
                              padding: "10px 14px",
                              verticalAlign: "top",
                              fontStyle: "italic",
                              color: "var(--db-cream)",
                              fontWeight: 600,
                            }}
                          >
                            {row["Species"]}
                          </td>
                          <td style={{ padding: "10px 14px", verticalAlign: "top" }}>
                            <span
                              style={{
                                color: "var(--db-stone)",
                                maxWidth: "240px",
                                display: "block",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {row["Title"]}
                            </span>
                          </td>
                          <td
                            style={{
                              padding: "10px 14px",
                              verticalAlign: "top",
                              color: "var(--db-stone)",
                              fontSize: "14px",
                            }}
                          >
                            {row["Institution"]}
                          </td>
                          <td style={{ padding: "10px 14px", verticalAlign: "top" }}>
                            <Pill
                              label={row["Library Strategy"]}
                              colors={
                                STRATEGY_COLORS[row["Library Strategy"]] || STRATEGY_FALLBACK
                              }
                            />
                          </td>
                          <td style={{ padding: "10px 14px", verticalAlign: "top" }}>
                            <Pill
                              label={row["Library Source"]}
                              colors={SOURCE_COLORS[row["Library Source"]] || SOURCE_FALLBACK}
                            />
                          </td>
                          <td
                            style={{
                              padding: "10px 14px",
                              verticalAlign: "top",
                              color: "var(--db-cream)",
                              fontSize: "14px",
                              fontFamily: "var(--font-mono)",
                              textAlign: "right",
                            }}
                          >
                            {row["Size (Mb)"]}
                          </td>
                          <td style={{ padding: "10px 14px", verticalAlign: "top" }}>
                            <a
                              href={row["Link"]}
                              target="_blank"
                              rel="noreferrer"
                              className="focus-ring"
                              style={{
                                color: "var(--db-cyan)",
                                fontFamily: "var(--font-mono)",
                                fontSize: "14px",
                                textDecoration: "underline",
                                textUnderlineOffset: "3px",
                              }}
                            >
                              {row["Accession"]}
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* ── Pagination ── */}
                <div
                  style={{
                    padding: "14px 16px",
                    borderTop: "var(--arcade-border) solid var(--db-cream)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    background: "var(--db-charcoal)",
                    flexWrap: "wrap",
                    gap: "12px",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "14px",
                      color: "var(--db-stone)",
                    }}
                  >
                    Showing {start}–{end} of {filteredData.length} datasets
                  </span>

                  <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      style={pageButtonStyle(false, currentPage === 1)}
                      onMouseEnter={(e) => {
                        if (currentPage === 1) return;
                        e.currentTarget.style.borderColor = "var(--db-cyan)";
                        e.currentTarget.style.color = "var(--db-cyan)";
                      }}
                      onMouseLeave={(e) => {
                        if (currentPage === 1) return;
                        e.currentTarget.style.borderColor = "var(--db-cream)";
                        e.currentTarget.style.color = "var(--db-cream)";
                      }}
                    >
                      ← Prev
                    </button>

                    {pageNumbers.map((p, idx) =>
                      p === "…" ? (
                        <span
                          key={`ellipsis-${idx}`}
                          style={{ color: "var(--db-stone)", padding: "0 4px", fontSize: "14px", fontFamily: "var(--font-mono)" }}
                        >
                          …
                        </span>
                      ) : (
                        <button
                          key={p}
                          onClick={() => setCurrentPage(p)}
                          style={pageButtonStyle(p === currentPage, false)}
                          onMouseEnter={(e) => {
                            if (p === currentPage) return;
                            e.currentTarget.style.borderColor = "var(--db-cyan)";
                            e.currentTarget.style.color = "var(--db-cyan)";
                          }}
                          onMouseLeave={(e) => {
                            if (p === currentPage) return;
                            e.currentTarget.style.borderColor = "var(--db-cream)";
                            e.currentTarget.style.color = "var(--db-cream)";
                          }}
                        >
                          {p}
                        </button>
                      )
                    )}

                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      style={pageButtonStyle(false, currentPage === totalPages)}
                      onMouseEnter={(e) => {
                        if (currentPage === totalPages) return;
                        e.currentTarget.style.borderColor = "var(--db-cyan)";
                        e.currentTarget.style.color = "var(--db-cyan)";
                      }}
                      onMouseLeave={(e) => {
                        if (currentPage === totalPages) return;
                        e.currentTarget.style.borderColor = "var(--db-cream)";
                        e.currentTarget.style.color = "var(--db-cream)";
                      }}
                    >
                      Next →
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
