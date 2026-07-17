"use client";

import { useCallback, useEffect, useState } from "react";
import PageShell from "@/components/site/PageShell";

interface Paper {
  pmid?: string;
  title: string;
  authorString?: string;
  pubYear?: string;
  journalTitle?: string;
  doi?: string;
  abstractText?: string;
  citedByCount?: number;
}

const CHIPS = [
  "Onthophagus taurus",
  "dung beetle genomics",
  "horn polyphenism",
  "Scarabaeinae evolution",
];

const DEFAULT_QUERY = "Onthophagus taurus";
const PAGE_SIZE = 10;
const MAX_PAGES = 100;

// ── Pagination helpers ──────────────────────────────────────────────────────

function getPageNumbers(current: number, total: number): (number | null)[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const show = new Set<number>();
  show.add(1); show.add(2);
  show.add(total - 1); show.add(total);
  for (let p = Math.max(1, current - 1); p <= Math.min(total, current + 1); p++) {
    show.add(p);
  }

  const sorted = Array.from(show).sort((a, b) => a - b);
  const result: (number | null)[] = [];
  let prev = 0;
  for (const p of sorted) {
    if (p - prev > 1) result.push(null);
    result.push(p);
    prev = p;
  }
  return result;
}

function pageButtonStyle(isActive: boolean, isDisabled: boolean): React.CSSProperties {
  return {
    background: isActive ? "#6366f1" : "#0c1028",
    border: `1px solid ${isActive ? "#6366f1" : "rgba(99,102,241,0.2)"}`,
    color: isActive ? "#ffffff" : "#94a3b8",
    borderRadius: "6px",
    padding: "6px 12px",
    fontSize: "13px",
    fontFamily: "var(--font-mono)",
    cursor: isDisabled ? "not-allowed" : "pointer",
    opacity: isDisabled ? 0.3 : 1,
    transition: "border-color 0.15s, color 0.15s",
    minWidth: "36px",
  };
}

// ── Component ───────────────────────────────────────────────────────────────

export default function LiteraturePage() {
  const [query, setQuery] = useState(DEFAULT_QUERY);
  const [inputValue, setInputValue] = useState(DEFAULT_QUERY);
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedAbstracts, setExpandedAbstracts] = useState<Set<string>>(new Set());

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [cursors, setCursors] = useState<string[]>(["*"]);
  const [totalResults, setTotalResults] = useState(0);

  // ── Core fetch ─────────────────────────────────────────────────────────────
  const fetchPage = useCallback(async (term: string, cursor: string) => {
    const res = await fetch(
      `/api/literature?query=${encodeURIComponent(term)}&cursor=${encodeURIComponent(cursor)}`
    );
    if (!res.ok) throw new Error("API error");
    return res.json();
  }, []);

  // ── New query search ───────────────────────────────────────────────────────
  const search = useCallback(
    async (term: string) => {
      if (!term.trim()) return;
      setLoading(true);
      setError(null);
      setPapers([]);
      setCurrentPage(1);
      setCursors(["*"]);
      setTotalResults(0);
      try {
        const data = await fetchPage(term, "*");
        setPapers(data.resultList?.result ?? []);
        setTotalResults(data.hitCount ?? 0);
        const next: string | undefined = data.nextCursorMark;
        if (next) setCursors(["*", next]);
      } catch {
        setError(
          "Unable to load results. The Europe PMC API may be temporarily unavailable."
        );
      } finally {
        setLoading(false);
      }
    },
    [fetchPage]
  );

  useEffect(() => {
    search(DEFAULT_QUERY);
  }, [search]);

  // ── Page navigation ────────────────────────────────────────────────────────
  const goToPage = useCallback(
    async (targetPage: number) => {
      if (!query.trim()) return;
      setLoading(true);
      setError(null);

      try {
        // Walk forward through cursors until we have the one for targetPage
        const knownCursors = [...cursors];
        while (knownCursors.length < targetPage) {
          const cursor = knownCursors[knownCursors.length - 1];
          const data = await fetchPage(query, cursor);
          const next: string | undefined = data.nextCursorMark;
          if (!next) break;
          knownCursors.push(next);
        }

        const targetCursor = knownCursors[targetPage - 1];
        if (targetCursor === undefined) {
          setLoading(false);
          return;
        }

        const data = await fetchPage(query, targetCursor);
        setPapers(data.resultList?.result ?? []);

        const next: string | undefined = data.nextCursorMark;
        if (next && knownCursors.length <= targetPage) knownCursors.push(next);

        setCursors(knownCursors);
        setCurrentPage(targetPage);
      } catch {
        setError(
          "Unable to load results. The Europe PMC API may be temporarily unavailable."
        );
      } finally {
        setLoading(false);
      }
    },
    [query, cursors, fetchPage]
  );

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setQuery(inputValue);
    search(inputValue);
  };

  const handleChip = (chip: string) => {
    setInputValue(chip);
    setQuery(chip);
    search(chip);
  };

  const toggleAbstract = (id: string) => {
    setExpandedAbstracts((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // ── Derived pagination values ──────────────────────────────────────────────
  const totalPages = Math.min(Math.ceil(totalResults / PAGE_SIZE), MAX_PAGES);
  const startResult = totalResults > 0 ? (currentPage - 1) * PAGE_SIZE + 1 : 0;
  const endResult = Math.min(currentPage * PAGE_SIZE, totalResults);
  const pageNumbers = totalPages > 1 ? getPageNumbers(currentPage, totalPages) : [];

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <PageShell>
      {/* ── Cinematic header ── */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          borderBottom: "1px solid rgba(0,240,255,0.12)",
        }}
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0.7,
          }}
        >
          <source src="/publications-bg.mp4" type="video/mp4" />
        </video>
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to bottom, rgba(3,3,3,0.5), rgba(3,3,3,0.95))",
          }}
        />
        <div style={{ position: "relative", zIndex: 1, padding: "6rem 1.25rem 4rem" }}>
        <div style={{ maxWidth: "1540px", margin: "0 auto", position: "relative" }}>
          <p className="db-eyebrow">
            DB² · Literature
          </p>
          <h1
            className="db-section-title"
            style={{ fontSize: "clamp(2.8rem, 5vw, 5.5rem)" }}
          >
            Literature
          </h1>
          <p className="db-section-copy" style={{ marginTop: "1.25rem", marginBottom: "2rem" }}>
            Real-time academic search powered by Europe PMC · 40M+ life sciences articles
          </p>

          {/* Search bar */}
          <form onSubmit={handleSubmit} style={{ maxWidth: "720px" }}>
            <div style={{ position: "relative" }}>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Search academic literature..."
                style={{
                  width: "100%",
                  padding: "0.85rem 5.5rem 0.85rem 1.25rem",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(141,124,255,0.3)",
                  borderRadius: "12px",
                  color: "var(--db-cream)",
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.95rem",
                  outline: "none",
                  boxSizing: "border-box",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) =>
                  (e.currentTarget.style.borderColor = "rgba(141,124,255,0.6)")
                }
                onBlur={(e) =>
                  (e.currentTarget.style.borderColor = "rgba(141,124,255,0.3)")
                }
              />
              <button
                type="submit"
                style={{
                  position: "absolute",
                  right: "0.5rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "rgba(141,124,255,0.15)",
                  border: "1px solid rgba(141,124,255,0.35)",
                  borderRadius: "8px",
                  color: "var(--db-violet)",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.65rem",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  padding: "0.4rem 0.9rem",
                  cursor: "pointer",
                }}
              >
                Search
              </button>
            </div>
          </form>

          {/* Quick-filter chips */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "1rem" }}>
            {CHIPS.map((chip) => (
              <button
                key={chip}
                onClick={() => handleChip(chip)}
                style={{
                  background: "rgba(141,124,255,0.07)",
                  border: "1px solid rgba(141,124,255,0.22)",
                  borderRadius: "999px",
                  color: "var(--db-muted)",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.64rem",
                  letterSpacing: "0.06em",
                  padding: "0.32rem 0.85rem",
                  cursor: "pointer",
                  transition: "border-color 0.18s, color 0.18s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "rgba(141,124,255,0.5)";
                  e.currentTarget.style.color = "var(--db-violet)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(141,124,255,0.22)";
                  e.currentTarget.style.color = "var(--db-muted)";
                }}
              >
                {chip}
              </button>
            ))}
          </div>
        </div>
        </div>
      </section>

      {/* ── Content ── */}
      <div style={{ maxWidth: "1540px", margin: "0 auto", padding: "4rem 1.25rem 6rem" }}>
        {/* Loading */}
        {loading && (
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.82rem",
              color: "var(--db-muted)",
              textAlign: "center",
              padding: "4rem 0",
              letterSpacing: "0.06em",
            }}
          >
            Searching literature...
          </p>
        )}

        {/* Error */}
        {!loading && error && (
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.88rem",
              color: "#ef4444",
              textAlign: "center",
              padding: "4rem 0",
              lineHeight: 1.6,
            }}
          >
            {error}
          </p>
        )}

        {/* No results */}
        {!loading && !error && papers.length === 0 && (
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.88rem",
              color: "var(--db-muted)",
              textAlign: "center",
              padding: "4rem 0",
            }}
          >
            No papers found for &ldquo;{query}&rdquo;. Try a different search term.
          </p>
        )}

        {/* Results */}
        {!loading && !error && papers.length > 0 && (
          <>
            {/* Count + range */}
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.66rem",
                color: "var(--db-muted)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: "1.5rem",
              }}
            >
              Showing results {startResult}–{endResult} of{" "}
              {totalResults.toLocaleString()} for &ldquo;{query}&rdquo;
            </div>

            {/* Cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {papers.map((paper, idx) => {
                const paperUrl = paper.doi
                  ? `https://doi.org/${paper.doi}`
                  : paper.pmid
                  ? `https://europepmc.org/article/MED/${paper.pmid}`
                  : "#";
                const pmcUrl = paper.pmid
                  ? `https://europepmc.org/article/MED/${paper.pmid}`
                  : paperUrl;
                const authorParts = paper.authorString
                  ? paper.authorString.split(", ")
                  : [];
                const authorStr =
                  authorParts.length > 3
                    ? authorParts.slice(0, 3).join(", ") + " et al."
                    : paper.authorString ?? "";
                const abstract = paper.abstractText ?? "";
                const cardKey = paper.pmid ?? paper.doi ?? String(idx);
                const isExpanded = expandedAbstracts.has(cardKey);
                const needsToggle = abstract.length > 200;
                const displayAbstract = isExpanded
                  ? abstract
                  : abstract.slice(0, 200) + (needsToggle ? "..." : "");

                return (
                  <div
                    key={cardKey}
                    className="db-glass"
                    style={{
                      padding: "1.5rem",
                      borderRadius: "18px",
                      borderLeft: "3px solid rgba(141,124,255,0.45)",
                    }}
                  >
                    {/* Title */}
                    <h3 style={{ margin: "0 0 0.4rem" }}>
                      <a
                        href={paperUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          fontFamily: "var(--font-sans)",
                          fontWeight: 600,
                          fontSize: "0.98rem",
                          color: "var(--db-cream)",
                          textDecoration: "none",
                          lineHeight: 1.5,
                          letterSpacing: "-0.02em",
                          transition: "color 0.15s",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.color = "var(--db-violet)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.color = "var(--db-cream)")
                        }
                      >
                        {paper.title}
                      </a>
                    </h3>

                    {/* Authors */}
                    {authorStr && (
                      <div
                        style={{
                          fontFamily: "var(--font-sans)",
                          fontSize: "0.8rem",
                          color: "var(--db-muted)",
                          marginBottom: "0.5rem",
                          lineHeight: 1.5,
                        }}
                      >
                        {authorStr}
                      </div>
                    )}

                    {/* Year · Journal · Badges */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: "0.5rem",
                        marginBottom: abstract ? "0.75rem" : 0,
                      }}
                    >
                      {paper.pubYear && (
                        <span
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "0.72rem",
                            fontWeight: 700,
                            color: "var(--db-violet)",
                          }}
                        >
                          {paper.pubYear}
                        </span>
                      )}
                      {paper.journalTitle && (
                        <span
                          style={{
                            fontFamily: "var(--font-sans)",
                            fontSize: "0.72rem",
                            color: "var(--db-muted)",
                            fontStyle: "italic",
                            opacity: 0.8,
                          }}
                        >
                          {paper.journalTitle}
                        </span>
                      )}
                      {paper.citedByCount != null && paper.citedByCount > 0 && (
                        <span
                          style={{
                            background: "rgba(141,124,255,0.1)",
                            color: "var(--db-violet)",
                            borderRadius: "999px",
                            padding: "0.14rem 0.55rem",
                            fontSize: "0.64rem",
                            fontFamily: "var(--font-mono)",
                          }}
                        >
                          Cited by {paper.citedByCount}
                        </span>
                      )}
                    </div>

                    {/* Abstract */}
                    {abstract && (
                      <p
                        style={{
                          fontFamily: "var(--font-sans)",
                          fontSize: "0.82rem",
                          color: "var(--db-stone)",
                          lineHeight: 1.65,
                          margin: "0 0 0.75rem",
                        }}
                      >
                        {displayAbstract}
                        {needsToggle && (
                          <button
                            onClick={() => toggleAbstract(cardKey)}
                            style={{
                              marginLeft: "0.4rem",
                              background: "none",
                              border: "none",
                              color: "var(--db-violet)",
                              fontFamily: "var(--font-mono)",
                              fontSize: "0.64rem",
                              letterSpacing: "0.04em",
                              cursor: "pointer",
                              padding: 0,
                            }}
                          >
                            {isExpanded ? "Show less" : "Show more"}
                          </button>
                        )}
                      </p>
                    )}

                    {/* Europe PMC link */}
                    <a
                      href={pmcUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.64rem",
                        color: "var(--db-violet)",
                        textDecoration: "none",
                        letterSpacing: "0.05em",
                        opacity: 0.8,
                        transition: "opacity 0.15s",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                      onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.8")}
                    >
                      View on Europe PMC →
                    </a>
                  </div>
                );
              })}
            </div>

            {/* ── Pagination ── */}
            {totalPages > 1 && (
              <div style={{ marginTop: "2.5rem" }}>
                {/* Range label */}
                <p
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.64rem",
                    color: "#94a3b8",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    textAlign: "center",
                    marginBottom: "1rem",
                  }}
                >
                  Showing results {startResult}–{endResult} of{" "}
                  {totalResults.toLocaleString()}
                  {totalResults > MAX_PAGES * PAGE_SIZE
                    ? ` (showing first ${MAX_PAGES} pages)`
                    : ""}
                </p>

                {/* Buttons */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.35rem",
                    flexWrap: "wrap",
                  }}
                >
                  {/* Prev */}
                  <button
                    disabled={currentPage === 1}
                    onClick={() => goToPage(currentPage - 1)}
                    style={pageButtonStyle(false, currentPage === 1)}
                    onMouseEnter={(e) => {
                      if (currentPage !== 1) {
                        e.currentTarget.style.borderColor = "rgba(99,102,241,0.5)";
                        e.currentTarget.style.color = "#f1f5f9";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (currentPage !== 1) {
                        e.currentTarget.style.borderColor = "rgba(99,102,241,0.2)";
                        e.currentTarget.style.color = "#94a3b8";
                      }
                    }}
                  >
                    ←
                  </button>

                  {/* Page numbers */}
                  {pageNumbers.map((p, i) =>
                    p === null ? (
                      <span
                        key={`ellipsis-${i}`}
                        style={{
                          color: "#475569",
                          fontFamily: "var(--font-mono)",
                          fontSize: "13px",
                          padding: "0 4px",
                          userSelect: "none",
                        }}
                      >
                        …
                      </span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => p !== currentPage && goToPage(p)}
                        style={pageButtonStyle(p === currentPage, false)}
                        onMouseEnter={(e) => {
                          if (p !== currentPage) {
                            e.currentTarget.style.borderColor = "rgba(99,102,241,0.5)";
                            e.currentTarget.style.color = "#f1f5f9";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (p !== currentPage) {
                            e.currentTarget.style.borderColor = "rgba(99,102,241,0.2)";
                            e.currentTarget.style.color = "#94a3b8";
                          }
                        }}
                      >
                        {p}
                      </button>
                    )
                  )}

                  {/* Next */}
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => goToPage(currentPage + 1)}
                    style={pageButtonStyle(false, currentPage === totalPages)}
                    onMouseEnter={(e) => {
                      if (currentPage !== totalPages) {
                        e.currentTarget.style.borderColor = "rgba(99,102,241,0.5)";
                        e.currentTarget.style.color = "#f1f5f9";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (currentPage !== totalPages) {
                        e.currentTarget.style.borderColor = "rgba(99,102,241,0.2)";
                        e.currentTarget.style.color = "#94a3b8";
                      }
                    }}
                  >
                    →
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Attribution */}
        <p
          style={{
            marginTop: "4rem",
            textAlign: "center",
            fontFamily: "var(--font-sans)",
            fontSize: "0.72rem",
            color: "var(--db-muted)",
            opacity: 0.55,
          }}
        >
          Literature data provided by Europe PMC (europepmc.org) · Updated in real time
        </p>
      </div>
    </PageShell>
  );
}
