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
    background: isActive ? "var(--db-cyan)" : "var(--db-black)",
    border: `2px solid ${isActive ? "var(--db-cyan)" : "var(--db-cream)"}`,
    color: isActive ? "var(--db-black)" : "var(--db-cream)",
    boxShadow: "3px 3px 0 var(--db-black)",
    padding: "0.55rem 0.7rem",
    fontSize: "0.6rem",
    lineHeight: 1.4,
    fontFamily: '"Arcade Glyphs", var(--font-pixel)',
    cursor: isDisabled ? "not-allowed" : "pointer",
    opacity: isDisabled ? 0.45 : 1,
    transition: "border-color 120ms steps(2, end), color 120ms steps(2, end)",
    minWidth: "40px",
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
          borderBottom: "var(--arcade-border) solid var(--db-cream)",
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
        <div style={{ position: "relative", zIndex: 1, padding: "4rem 1.25rem 3rem" }}>
        <div
          className="arcade-panel"
          style={{ maxWidth: "820px", margin: "0 auto 0 max(0px, calc((100% - 1540px) / 2))", position: "relative", padding: "22px" }}
        >
          <p className="db-eyebrow">
            DB² · Literature
          </p>
          <h1
            className="arcade-title"
            style={{ fontSize: "clamp(1.4rem, 3.2vw, 2rem)", lineHeight: 1.3, marginTop: "14px" }}
          >
            Literature
          </h1>
          <p
            style={{
              marginTop: "1rem",
              marginBottom: "1.5rem",
              fontFamily: "var(--font-sans)",
              fontSize: "15px",
              lineHeight: 1.6,
              color: "var(--db-cream)",
            }}
          >
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
                className="arcade-input"
                style={{
                  width: "100%",
                  padding: "0.8rem 7.5rem 0.8rem 0.9rem",
                  fontFamily: "var(--font-sans)",
                  fontSize: "15px",
                  boxSizing: "border-box",
                }}
                onFocus={(e) =>
                  (e.currentTarget.style.borderColor = "var(--db-cyan)")
                }
                onBlur={(e) =>
                  (e.currentTarget.style.borderColor = "var(--db-cream)")
                }
              />
              <button
                type="submit"
                className="arcade-btn arcade-btn--small"
                style={{
                  position: "absolute",
                  right: "0.6rem",
                  top: "0.55rem",
                  boxShadow: "none",
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
                className={query === chip ? "arcade-toggle arcade-toggle--active" : "arcade-toggle"}
                style={{ textTransform: "none", fontFamily: "var(--font-sans)", fontSize: "14px", fontWeight: 600 }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--db-cyan)";
                  e.currentTarget.style.color = "";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "";
                  e.currentTarget.style.color = "";
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
            className="arcade-panel"
            style={{
              fontFamily: "var(--font-pixel)",
              fontSize: "0.65rem",
              lineHeight: 1.6,
              textTransform: "uppercase",
              color: "var(--db-cream)",
              textAlign: "center",
              padding: "3rem 1rem",
              margin: 0,
            }}
          >
            <span className="blink" style={{ display: "inline-block", width: "10px", height: "10px", background: "var(--db-cyan)", marginRight: "12px" }} />
            Searching literature...
          </p>
        )}

        {/* Error */}
        {!loading && error && (
          <p
            className="arcade-panel"
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "15px",
              color: "var(--db-cream)",
              borderColor: "var(--arcade-pink)",
              textAlign: "center",
              padding: "2.5rem 1.25rem",
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            <span className="pixel-glyphs" style={{ color: "var(--arcade-pink)", fontSize: "0.7rem", marginRight: "10px" }}>⚠</span>
            {error}
          </p>
        )}

        {/* No results */}
        {!loading && !error && papers.length === 0 && (
          <p
            className="arcade-panel"
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "15px",
              color: "var(--db-stone)",
              textAlign: "center",
              padding: "2.5rem 1.25rem",
              lineHeight: 1.6,
              margin: 0,
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
                fontSize: "14px",
                color: "var(--db-stone)",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                marginBottom: "1.5rem",
              }}
            >
              Showing results {startResult}–{endResult} of{" "}
              {totalResults.toLocaleString()} for &ldquo;{query}&rdquo;
            </div>

            {/* Cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
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
                    className="arcade-panel"
                    style={{
                      padding: "0 22px 22px",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    {/* Title */}
                    <h3 style={{ margin: "0 0 0.5rem", order: 1 }}>
                      <a
                        href={paperUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          fontFamily: "var(--font-sans)",
                          fontWeight: 700,
                          fontSize: "17px",
                          color: "var(--db-cream)",
                          textDecoration: "none",
                          lineHeight: 1.45,
                        }}
                        className="focus-ring"
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.color = "var(--db-cyan)")
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
                          order: 2,
                          fontFamily: "var(--font-sans)",
                          fontSize: "15px",
                          color: "var(--db-stone)",
                          marginBottom: "0.75rem",
                          lineHeight: 1.5,
                        }}
                      >
                        {authorStr}
                      </div>
                    )}

                    {/* Year · Journal · Badges */}
                    <div
                      className="arcade-panel__bar"
                      style={{
                        order: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        flexWrap: "wrap",
                        gap: "0.5rem 0.9rem",
                        margin: "0 -22px 16px",
                        minHeight: "40px",
                      }}
                    >
                      {paper.pubYear && (
                        <span
                          style={{
                            fontFamily: "var(--font-pixel)",
                            fontSize: "0.6rem",
                            color: "var(--db-black)",
                          }}
                        >
                          {paper.pubYear}
                        </span>
                      )}
                      {paper.journalTitle && (
                        <span
                          style={{
                            fontFamily: "var(--font-sans)",
                            fontSize: "14px",
                            fontWeight: 600,
                            textTransform: "none",
                            color: "var(--db-black)",
                            fontStyle: "italic",
                          }}
                        >
                          {paper.journalTitle}
                        </span>
                      )}
                      {paper.citedByCount != null && paper.citedByCount > 0 && (
                        <span
                          style={{
                            background: "var(--db-black)",
                            color: "var(--db-cyan)",
                            padding: "0.15rem 0.5rem",
                            fontSize: "14px",
                            fontFamily: "var(--font-mono)",
                            textTransform: "none",
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
                          order: 3,
                          fontFamily: "var(--font-sans)",
                          fontSize: "15px",
                          color: "var(--db-stone)",
                          lineHeight: 1.65,
                          margin: "0 0 1rem",
                        }}
                      >
                        {displayAbstract}
                        {needsToggle && (
                          <button
                            onClick={() => toggleAbstract(cardKey)}
                            className="focus-ring"
                            style={{
                              marginLeft: "0.5rem",
                              background: "none",
                              border: "none",
                              color: "var(--db-cyan)",
                              fontFamily: "var(--font-pixel)",
                              fontSize: "0.55rem",
                              textTransform: "uppercase",
                              textDecoration: "underline",
                              textUnderlineOffset: "3px",
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
                      className="arcade-btn arcade-btn--small pixel-glyphs"
                      style={{
                        order: 4,
                        alignSelf: "flex-start",
                        opacity: 1,
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                      onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
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
                    fontSize: "14px",
                    color: "var(--db-stone)",
                    letterSpacing: "0.04em",
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
                    gap: "0.5rem",
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
                        e.currentTarget.style.borderColor = "var(--db-cyan)";
                        e.currentTarget.style.color = "var(--db-cyan)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (currentPage !== 1) {
                        e.currentTarget.style.borderColor = "var(--db-cream)";
                        e.currentTarget.style.color = "var(--db-cream)";
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
                          color: "var(--db-stone)",
                          fontFamily: "var(--font-mono)",
                          fontSize: "14px",
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
                            e.currentTarget.style.borderColor = "var(--db-cyan)";
                            e.currentTarget.style.color = "var(--db-cyan)";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (p !== currentPage) {
                            e.currentTarget.style.borderColor = "var(--db-cream)";
                            e.currentTarget.style.color = "var(--db-cream)";
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
                        e.currentTarget.style.borderColor = "var(--db-cyan)";
                        e.currentTarget.style.color = "var(--db-cyan)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (currentPage !== totalPages) {
                        e.currentTarget.style.borderColor = "var(--db-cream)";
                        e.currentTarget.style.color = "var(--db-cream)";
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
            fontSize: "14px",
            color: "var(--db-stone)",
          }}
        >
          Literature data provided by Europe PMC (europepmc.org) · Updated in real time
        </p>
      </div>
    </PageShell>
  );
}
