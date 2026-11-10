"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import PageShell from "@/components/site/PageShell";
import BlastResults, { cardStyle } from "@/components/blast/BlastResults";
import SaveSearch from "@/components/blast/SaveSearch";

type Program = "blastn" | "blastp" | "blastx" | "tblastn";
type Phase = "input" | "submitted" | "polling" | "results" | "error";

const PROGRAMS: {
  value: Program;
  label: string;
  sub: string;
  description: string;
}[] = [
  {
    value: "blastn",
    label: "BLASTN",
    sub: "DNA→DNA",
    description: "Search nucleotide databases with a nucleotide query",
  },
  {
    value: "blastp",
    label: "BLASTP",
    sub: "Protein→Protein",
    description: "Search protein databases with a protein query",
  },
  {
    value: "blastx",
    label: "BLASTX",
    sub: "DNA→Protein",
    description:
      "Search protein databases using a translated nucleotide query",
  },
  {
    value: "tblastn",
    label: "TBLASTN",
    sub: "Protein→DNA",
    description: "Search translated nucleotide databases with a protein query",
  },
];

// Taxon IDs verified against NCBI Taxonomy (esummary): 166361 = Onthophagus taurus (species),
// 41142 = Scarabaeinae (subfamily), 50557 = Insecta (class).
const ENTREZ_OPTIONS = [
  { label: "O. taurus genome", value: "txid166361[Organism]" },
  { label: "All Scarabaeinae", value: "txid41142[Organism]" },
  { label: "All insects", value: "txid50557[Organism]" },
  { label: "All NCBI", value: "" },
];

// Real O. taurus COI fragment (NCBI MH020533.1, bases 1-600, fetched with efetch).
const EXAMPLE_SEQUENCE = `>MH020533.1:1-600 Onthophagus taurus clone W93b-C1J-2183 cytochrome oxidase subunit I (COI) gene, partial cds; mitochondrial
ATTTCTCATATTATTAGTCAAGAAAGAAGAAAAAAAGAAACTTTTGGCACATTAGGCATA
ATCTATGCAATAATGGCTATTGGATTACTTGGATTTATTGTATGAGCTCATCATATATTT
ACTGTAGGTATAGACGTAGATACTCGAGCTTACTTTACATCAGCAACAATAATTATTGCA
GTACCAACTGGTATTAAAATTTTTAGCTGACTTGCTACTCTTCATGGAACTCAACTAAAT
TATTCACCATCAATAATTTGAGCATTAGGATTTGTATTCCTATTTACTGTAGGAGGATTA
ACAGGAGTAATTTTAGCTAATTCATCCTTAGATATTGTATTACATGACACATATAATGTT
GTTGCTCACTTCCATTATGTTTTATCAATAGGAGCAGTATTTGCTATTATAGCAGGATTT
GTTCATTGATTCCCATTATTTACAGGACTTACAATAAATAGAAAATTTCTAAAAATCCAA
TTTTTAATTATATTCATTGGAGTTAATATAACCTTTTTCCCTCAACACTTTCTAGGTTTA
GCAGGAATACCTCGACGATACTCAGACTATCCAGATGCATATACAACATGAAATGTAATT`;

/*
 * Keeps a logged-out user's search across the login redirect. sessionStorage is
 * per-tab and may be blocked or full, so every call is guarded; on any failure
 * the page simply behaves as before (nothing restored).
 */
// NCBI polling policy (see the polling effect in BlastPage).
const MIN_FIRST_POLL_S = 15; // first status check after max(RTOE, 15 s)
const POLL_INTERVAL_MS = 60_000; // then at most once a minute
const POLL_GIVE_UP_MS = 20 * 60_000; // stop checking after ~20 minutes

const LOGIN_STASH_KEY = "db2:blast:before-login";
const LOGIN_STASH_MAX_AGE_MS = 2 * 60 * 60 * 1000;

type LoginStash = {
  v: 1;
  at: number;
  form: {
    sequence: string;
    program: string;
    entrezQuery: string;
    evalue: string;
    hitlistSize: number;
    advancedOpen: boolean;
  };
  rid: string | null;
  results: any;
};

function saveLoginStash(data: Omit<LoginStash, "v" | "at">) {
  const full: LoginStash = { v: 1, at: Date.now(), ...data };
  try {
    sessionStorage.setItem(LOGIN_STASH_KEY, JSON.stringify(full));
    return;
  } catch {
    // Probably over the storage quota (very large results): keep the form only.
  }
  try {
    sessionStorage.setItem(LOGIN_STASH_KEY, JSON.stringify({ ...full, rid: null, results: null }));
  } catch {
    // Storage blocked: nothing to keep.
  }
}

function takeLoginStash(): LoginStash | null {
  let raw: string | null = null;
  try {
    raw = sessionStorage.getItem(LOGIN_STASH_KEY);
    sessionStorage.removeItem(LOGIN_STASH_KEY);
  } catch {
    return null;
  }
  if (!raw) return null;
  try {
    const s = JSON.parse(raw) as LoginStash;
    if (s?.v !== 1 || typeof s.at !== "number" || Date.now() - s.at > LOGIN_STASH_MAX_AGE_MS) return null;
    if (!s.form || typeof s.form !== "object") return null;
    const resultsOk = Array.isArray(s.results?.BlastOutput2);
    const ridOk = typeof s.rid === "string" && /^[A-Za-z0-9_-]{1,64}$/.test(s.rid);
    return { ...s, rid: resultsOk && ridOk ? s.rid : null, results: resultsOk && ridOk ? s.results : null };
  } catch {
    return null;
  }
}

function databaseForProgram(program: Program): "nt" | "nr" {
  return program === "blastp" || program === "tblastn" ? "nr" : "nt";
}

// Arcade theme: inputs and toggles use shared classes from globals.css.
const inputStyle: React.CSSProperties = {};

function pillClass(active: boolean): string {
  return active ? "arcade-toggle arcade-toggle--active" : "arcade-toggle";
}

// Title bar spanning the full width of a 20px-padded panel.
const panelBar: React.CSSProperties = { margin: "-20px -20px 18px" };

const subHeading: React.CSSProperties = {
  fontFamily: "var(--font-pixel)",
  fontSize: "0.6rem",
  lineHeight: 1.5,
  textTransform: "uppercase",
  color: "var(--db-cream)",
  marginBottom: "12px",
};

const helpText: React.CSSProperties = {
  fontFamily: "var(--font-sans)",
  fontSize: "14px",
  lineHeight: 1.55,
  color: "var(--db-stone)",
};

const monoMeta: React.CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: "14px",
  color: "var(--db-stone)",
};

export default function BlastPage() {
  const [sequence, setSequence] = useState("");
  const [program, setProgram] = useState<Program>("blastn");
  const [entrezQuery, setEntrezQuery] = useState(ENTREZ_OPTIONS[0].value);
  const [evalue, setEvalue] = useState("0.001");
  const [hitlistSize, setHitlistSize] = useState(50);
  const [advancedOpen, setAdvancedOpen] = useState(false);

  const [phase, setPhase] = useState<Phase>("input");
  const [rid, setRid] = useState<string | null>(null);
  const [estimatedSeconds, setEstimatedSeconds] = useState(60);
  const estimatedRef = useRef(60);
  const [errorRid, setErrorRid] = useState<string | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [results, setResults] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const ridRef = useRef<string | null>(null);
  const database = useMemo(() => databaseForProgram(program), [program]);

  useEffect(() => {
    ridRef.current = rid;
  }, [rid]);

  // Back from "Log in to save this search": restore the stashed form and results
  // (no NCBI calls), then clear the stash. Skipped when ?from= is pre-filling.
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("from")) return;
    const stash = takeLoginStash();
    if (!stash) return;
    const f = stash.form;
    if (typeof f.sequence === "string") setSequence(f.sequence);
    if (PROGRAMS.some((p) => p.value === f.program)) setProgram(f.program as Program);
    if (ENTREZ_OPTIONS.some((o) => o.value === f.entrezQuery)) setEntrezQuery(f.entrezQuery);
    if (typeof f.evalue === "string" && f.evalue) setEvalue(f.evalue);
    if (Number.isInteger(f.hitlistSize) && f.hitlistSize > 0) setHitlistSize(f.hitlistSize);
    if (f.advancedOpen === true) setAdvancedOpen(true);
    if (stash.rid && stash.results) {
      setRid(stash.rid);
      setResults(stash.results);
      setPhase("results");
    }
  }, []);

  function stashBeforeLogin() {
    saveLoginStash({
      form: { sequence, program, entrezQuery, evalue, hitlistSize, advancedOpen },
      rid,
      results,
    });
  }

  // "Run again" from a saved search: /blast?from=<id> pre-fills the form (never
  // auto-submits). The API only returns the job to its owner, so anyone else's
  // id simply leaves the form empty.
  useEffect(() => {
    const from = new URLSearchParams(window.location.search).get("from");
    if (!from) return;
    let cancelled = false;
    fetch(`/api/saved-blast/${encodeURIComponent(from)}?summary=1`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        const job = data?.job;
        if (cancelled || !job) return;
        if (typeof job.querySequence === "string") setSequence(job.querySequence);
        if (PROGRAMS.some((p) => p.value === job.program)) setProgram(job.program as Program);
        if (ENTREZ_OPTIONS.some((o) => o.value === job.entrezQuery)) setEntrezQuery(job.entrezQuery);
        if (job.evalue) setEvalue(String(job.evalue));
        const size = Number(job.hitlistSize);
        if (Number.isInteger(size) && size > 0) setHitlistSize(size);
        if (String(job.evalue) !== "0.001" || size !== 50) setAdvancedOpen(true);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  /*
   * NCBI usage policy: wait the estimated time (RTOE, at least 15 s) before the
   * first status check, then check at most once a minute. Exactly one polling
   * loop exists per search: it is a chain of timeouts (the next check is only
   * scheduled after the previous one finishes) and is torn down when the phase
   * changes or the page unmounts. The elapsed counter is a separate 1 s timer
   * that makes no network calls.
   */
  useEffect(() => {
    if (phase !== "polling" || !rid) return;
    const pollRid = rid;
    const startedAt = Date.now();
    let stopped = false;
    let pollTimer: ReturnType<typeof setTimeout> | undefined;

    const tick = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startedAt) / 1000));
    }, 1000);

    function stop() {
      stopped = true;
      clearInterval(tick);
      if (pollTimer) clearTimeout(pollTimer);
    }

    function fail(message: string, withRid = false) {
      stop();
      setErrorMessage(message);
      setErrorRid(withRid ? pollRid : null);
      setPhase("error");
    }

    async function poll() {
      if (stopped) return;
      if (Date.now() - startedAt > POLL_GIVE_UP_MS) {
        fail(
          `NCBI hasn't finished this search after 20 minutes, so this page stopped checking. ` +
            `NCBI keeps results for about a day; you can check on them there using Request ID ${pollRid}.`,
          true
        );
        return;
      }
      try {
        const statusRes = await fetch(`/api/blast/status?rid=${pollRid}`);
        const statusData = await statusRes.json();
        if (stopped) return;

        if (statusData.status === "READY") {
          stop();
          const resultsRes = await fetch(`/api/blast/results?rid=${pollRid}`);
          const resultsData = await resultsRes.json();
          setResults(resultsData);
          setPhase("results");
          return;
        }
        if (statusData.status === "FAILED" || statusData.status === "UNKNOWN") {
          fail(
            "NCBI BLAST returned an error. This may be due to server load or an invalid sequence."
          );
          return;
        }
        pollTimer = setTimeout(poll, POLL_INTERVAL_MS);
      } catch {
        if (!stopped) fail("Lost connection while polling NCBI for results.");
      }
    }

    const firstCheckMs = Math.max(MIN_FIRST_POLL_S, estimatedRef.current) * 1000;
    pollTimer = setTimeout(poll, firstCheckMs);

    return stop;
  }, [phase, rid]);

  function resetToInput() {
    setPhase("input");
    setRid(null);
    setResults(null);
    setErrorMessage("");
    setErrorRid(null);
    setElapsedSeconds(0);
  }

  async function handleSubmit() {
    setPhase("submitted");
    setErrorMessage("");
    setErrorRid(null);
    try {
      const res = await fetch("/api/blast/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sequence,
          program,
          database,
          entrezQuery,
          evalue: Number(evalue) || 0.001,
          hitlistSize,
        }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setErrorMessage(data.error || "Failed to submit BLAST job.");
        setPhase("error");
        return;
      }
      setRid(data.rid);
      estimatedRef.current = data.estimatedSeconds || 60;
      setEstimatedSeconds(data.estimatedSeconds || 60);
      setElapsedSeconds(0);
      setPhase("polling");
    } catch {
      setErrorMessage("Could not reach the BLAST submission endpoint.");
      setPhase("error");
    }
  }

  const activeProgram = PROGRAMS.find((p) => p.value === program)!;

  return (
    <PageShell>
      <div style={{ background: "var(--db-black)", minHeight: "100vh" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "40px 20px 64px" }}>
          {/* Header */}
          <div style={{ marginBottom: "32px" }}>
            <p className="db-eyebrow" style={{ margin: 0 }}>
              DB² · SEQUENCE SEARCH
            </p>
            <h1
              className="arcade-title"
              style={{
                fontSize: "clamp(1.4rem, 3.2vw, 2rem)",
                margin: "14px 0 0",
              }}
            >
              BLAST Search
            </h1>
            <p
              style={{
                ...helpText,
                fontSize: "15px",
                lineHeight: 1.65,
                maxWidth: "640px",
                marginTop: "14px",
              }}
            >
              Search nucleotide or protein sequences against the Onthophagus
              taurus genome and related Scarabaeinae using NCBI BLAST. Results
              are retrieved from NCBI servers and typically take 1–5 minutes.
            </p>
          </div>

          {phase === "input" && (
            <InputPhase
              sequence={sequence}
              setSequence={setSequence}
              program={program}
              setProgram={setProgram}
              activeProgram={activeProgram}
              entrezQuery={entrezQuery}
              setEntrezQuery={setEntrezQuery}
              evalue={evalue}
              setEvalue={setEvalue}
              hitlistSize={hitlistSize}
              setHitlistSize={setHitlistSize}
              advancedOpen={advancedOpen}
              setAdvancedOpen={setAdvancedOpen}
              onSubmit={handleSubmit}
            />
          )}

          {(phase === "submitted" || phase === "polling") && (
            <StatusPhase
              rid={rid}
              elapsedSeconds={elapsedSeconds}
              estimatedSeconds={estimatedSeconds}
              onCancel={resetToInput}
            />
          )}

          {phase === "results" && (
            <>
              <SaveSearch
                rid={rid}
                program={program}
                database={database}
                entrezQuery={entrezQuery}
                evalue={Number(evalue) || 0.001}
                hitlistSize={hitlistSize}
                querySequence={sequence}
                results={results}
                onLoginClick={stashBeforeLogin}
              />
              <BlastResults
                results={results}
                program={program}
                database={database}
                rid={rid}
                querySequence={sequence}
                onNewSearch={resetToInput}
              />
            </>
          )}

          {phase === "error" && (
            <ErrorPhase errorMessage={errorMessage} onRetry={resetToInput} rid={errorRid} />
          )}
        </div>
      </div>
    </PageShell>
  );
}

function InputPhase({
  sequence,
  setSequence,
  program,
  setProgram,
  activeProgram,
  entrezQuery,
  setEntrezQuery,
  evalue,
  setEvalue,
  hitlistSize,
  setHitlistSize,
  advancedOpen,
  setAdvancedOpen,
  onSubmit,
}: {
  sequence: string;
  setSequence: (v: string) => void;
  program: Program;
  setProgram: (v: Program) => void;
  activeProgram: (typeof PROGRAMS)[number];
  entrezQuery: string;
  setEntrezQuery: (v: string) => void;
  evalue: string;
  setEvalue: (v: string) => void;
  hitlistSize: number;
  setHitlistSize: (v: number) => void;
  advancedOpen: boolean;
  setAdvancedOpen: (v: boolean) => void;
  onSubmit: () => void;
}) {
  return (
    <div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.4fr 1fr",
          gap: "20px",
        }}
        className="db-blast-grid"
      >
        {/* Sequence input */}
        <div style={cardStyle}>
          <div className="arcade-panel__bar" style={panelBar}>
            Query Sequence
          </div>
          <div
            style={{
              ...helpText,
              marginBottom: "12px",
            }}
          >
            Enter nucleotide or protein sequence in FASTA format or as a
            plain sequence string.
          </div>
          <textarea
            value={sequence}
            onChange={(e) => setSequence(e.target.value)}
            placeholder={">example_sequence\nATGCATGCATGCATGC..."}
            className="arcade-input"
            style={{
              width: "100%",
              height: "220px",
              resize: "vertical",
              lineHeight: 1.6,
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "var(--db-cyan)")}
            onBlur={(e) =>
              (e.currentTarget.style.borderColor = "var(--db-cream)")
            }
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "12px",
              flexWrap: "wrap",
              marginTop: "12px",
            }}
          >
            <span style={monoMeta}>
              {sequence.length} characters
            </span>
            <button
              onClick={() => setSequence(EXAMPLE_SEQUENCE)}
              className="arcade-btn arcade-btn--small"
            >
              Load example
            </button>
          </div>
        </div>

        {/* Parameters */}
        <div style={cardStyle}>
          {/* Program */}
          <div style={{ marginBottom: "22px" }}>
            <div className="arcade-panel__bar" style={panelBar}>
              Program
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {PROGRAMS.map((p) => (
                <button
                  key={p.value}
                  onClick={() => setProgram(p.value)}
                  className={pillClass(program === p.value)}
                >
                  {p.label} ({p.sub})
                </button>
              ))}
            </div>
            <div
              style={{
                ...helpText,
                marginTop: "10px",
              }}
            >
              {activeProgram.description}
            </div>
          </div>

          {/* Search scope */}
          <div style={{ marginBottom: "22px" }}>
            <div style={subHeading}>
              Search against
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {ENTREZ_OPTIONS.map((opt) => (
                <button
                  key={opt.label}
                  onClick={() => setEntrezQuery(opt.value)}
                  className={pillClass(entrezQuery === opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <div
              style={{
                ...monoMeta,
                marginTop: "10px",
              }}
            >
              {entrezQuery || "(no restriction)"}
            </div>
          </div>

          {/* Advanced */}
          <div>
            <button
              onClick={() => setAdvancedOpen(!advancedOpen)}
              className={pillClass(advancedOpen)}
            >
              Advanced options {advancedOpen ? "▴" : "▾"}
            </button>
            {advancedOpen && (
              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  marginTop: "14px",
                  flexWrap: "wrap",
                }}
              >
                <label style={{ flex: 1, minWidth: "120px" }}>
                  <div
                    style={{
                      ...subHeading,
                      fontSize: "0.55rem",
                      marginBottom: "8px",
                    }}
                  >
                    E-value
                  </div>
                  <input
                    type="number"
                    value={evalue}
                    onChange={(e) => setEvalue(e.target.value)}
                    className="arcade-input"
                    style={{ ...inputStyle, width: "100%" }}
                  />
                </label>
                <label style={{ flex: 1, minWidth: "120px" }}>
                  <div
                    style={{
                      ...subHeading,
                      fontSize: "0.55rem",
                      marginBottom: "8px",
                    }}
                  >
                    Max hits
                  </div>
                  <input
                    type="number"
                    value={hitlistSize}
                    onChange={(e) =>
                      setHitlistSize(parseInt(e.target.value) || 50)
                    }
                    className="arcade-input"
                    style={{ ...inputStyle, width: "100%" }}
                  />
                </label>
              </div>
            )}
          </div>
        </div>
      </div>

      <button
        onClick={onSubmit}
        disabled={sequence.trim().length === 0}
        className="arcade-btn arcade-btn--cta pixel-glyphs"
        style={{
          width: "100%",
          padding: "1rem",
          fontSize: "0.7rem",
          marginTop: "28px",
        }}
      >
        Run BLAST Search →
      </button>

      <style>{`
        @media (max-width: 800px) {
          .db-blast-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

function StatusPhase({
  rid,
  elapsedSeconds,
  estimatedSeconds,
  onCancel,
}: {
  rid: string | null;
  elapsedSeconds: number;
  estimatedSeconds: number;
  onCancel: () => void;
}) {
  const pct = Math.min(100, (elapsedSeconds / Math.max(1, estimatedSeconds)) * 100);
  return (
    <div
      style={{
        ...cardStyle,
        position: "relative",
        maxWidth: "640px",
        margin: "40px auto",
        padding: "0 24px 28px",
        textAlign: "center",
      }}
    >
      <div
        aria-hidden="true"
        className="blink"
        style={{
          position: "absolute",
          top: "14px",
          right: "16px",
          width: "12px",
          height: "12px",
          background: "var(--db-cyan)",
          boxShadow: "2px 2px 0 var(--db-black)",
        }}
      />
      <div
        className="arcade-panel__bar"
        style={{ margin: "0 -24px 22px", padding: "0.75rem 2.5rem 0.75rem 0.9rem" }}
      >
        BLAST job submitted
      </div>
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "15px",
          color: "var(--db-cream)",
        }}
      >
        Request ID: {rid || "…"}
      </div>
      <div
        style={{
          ...helpText,
          fontSize: "15px",
          marginTop: "10px",
        }}
      >
        Searching NCBI databases...
      </div>

      <div
        style={{
          display: "flex",
          gap: "12px 28px",
          flexWrap: "wrap",
          justifyContent: "center",
          marginTop: "22px",
        }}
      >
        <span style={{ ...subHeading, marginBottom: 0, fontSize: "0.58rem" }}>
          Elapsed: {elapsedSeconds}s
        </span>
        <span style={{ ...subHeading, marginBottom: 0, fontSize: "0.58rem" }}>
          Estimated wait: ~{estimatedSeconds}s
        </span>
      </div>

      <div
        className="arcade-progress"
        style={{
          maxWidth: "440px",
          margin: "16px auto 0",
        }}
      >
        <div
          className="arcade-progress__fill"
          style={{
            width: `${pct}%`,
          }}
        />
      </div>

      <div
        style={{
          ...helpText,
          textAlign: "center",
          marginTop: "22px",
        }}
      >
        NCBI BLAST searches typically take 1–5 minutes depending on query
        length and server load.
      </div>
      <div
        style={{
          ...helpText,
          textAlign: "center",
          marginTop: "8px",
        }}
      >
        NCBI is asked for results about once a minute, so this can take up to a minute longer than the estimate.
      </div>

      <button
        onClick={onCancel}
        className="arcade-btn arcade-btn--small"
        style={{
          marginTop: "24px",
        }}
      >
        Cancel and start over
      </button>
    </div>
  );
}

function ErrorPhase({
  errorMessage,
  onRetry,
  rid,
}: {
  errorMessage: string;
  onRetry: () => void;
  rid?: string | null;
}) {
  return (
    <div
      style={{
        ...cardStyle,
        maxWidth: "640px",
        margin: "40px auto",
        padding: "0 24px 28px",
        textAlign: "center",
        borderColor: "var(--arcade-pink)",
      }}
    >
      <div
        className="arcade-panel__bar pixel-glyphs"
        style={{
          margin: "0 -24px 22px",
          justifyContent: "center",
          background: "var(--arcade-pink)",
          borderBottomColor: "var(--arcade-pink)",
          color: "var(--db-black)",
        }}
      >
        ⚠ BLAST search failed
      </div>
      <div
        style={{
          ...helpText,
          fontSize: "15px",
          lineHeight: 1.65,
          color: "var(--db-cream)",
          overflowWrap: "anywhere",
        }}
      >
        {errorMessage ||
          "NCBI BLAST returned an error. This may be due to server load or an invalid sequence."}
      </div>
      <div
        style={{
          display: "flex",
          gap: "16px",
          flexWrap: "wrap",
          justifyContent: "center",
          marginTop: "24px",
        }}
      >
        <button
          onClick={onRetry}
          className="arcade-btn"
        >
          Try again
        </button>
        <a
          href={
            rid
              ? `https://blast.ncbi.nlm.nih.gov/Blast.cgi?CMD=Get&RID=${encodeURIComponent(rid)}`
              : "https://blast.ncbi.nlm.nih.gov"
          }
          target="_blank"
          rel="noreferrer"
          className="auth-inline-link"
          style={{
            fontSize: "15px",
            fontFamily: "var(--font-sans)",
            alignSelf: "center",
          }}
        >
          {rid ? `View ${rid} on NCBI →` : "Check NCBI BLAST status"}
        </a>
      </div>
    </div>
  );
}
