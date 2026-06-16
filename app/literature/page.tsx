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

export default function LiteraturePage() {
  const [query, setQuery] = useState(DEFAULT_QUERY);
  const [inputValue, setInputValue] = useState(DEFAULT_QUERY);
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedAbstracts, setExpandedAbstracts] = useState<Set<string>>(new Set());

  const search = useCallback(async (term: string) => {
    if (!term.trim()) return;
    setLoading(true);
    setError(null);
    setPapers([]);
    try {
      const res = await fetch(`/api/literature?query=${encodeURIComponent(term)}`);
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      setPapers(data.resultList?.result ?? []);
    } catch {
      setError(
        "Unable to load results. The Europe PMC API may be temporarily unavailable."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    search(DEFAULT_QUERY);
  }, [search]);

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

  const toggleAbstract = (paperId: string) => {
    setExpandedAbstracts((prev) => {
      const next = new Set(prev);
      if (next.has(paperId)) next.delete(paperId);
      else next.add(paperId);
      return next;
    });
  };

  return (
    <PageShell>
      {/* ── Hero ── */}
      <div
        style={{
          padding: "6rem 1.25rem 4rem",
          borderBottom: "1px solid var(--db-line)",
          position: "relative",
          overflow: "hidden",
          background:
            "radial-gradient(circle at 75% 25%, rgba(141,124,255,0.07), transparent 36%), var(--db-black)",
        }}
      >
        <div style={{ maxWidth: "1540px", margin: "0 auto", position: "relative" }}>
          <p className="db-eyebrow" style={{ color: "var(--db-violet)" }}>
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
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.5rem",
              marginTop: "1rem",
            }}
          >
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
            {/* Count */}
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
              Showing {papers.length} results for &ldquo;{query}&rdquo;
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
