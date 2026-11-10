import { z } from "zod";

/* Limits for saved BLAST jobs. */
export const MAX_LABEL = 120;
export const MAX_QUERY_CHARS = 200_000;
export const MAX_RESULT_BYTES = 5 * 1024 * 1024; // serialized result JSON
export const MAX_REQUEST_BYTES = MAX_RESULT_BYTES + MAX_QUERY_CHARS * 4 + 64 * 1024; // whole POST body
export const MAX_JOBS_PER_USER = 200;

export const PROGRAMS = ["blastn", "blastp", "blastx", "tblastn"] as const;

export function defaultLabel(program: string, query: string): string {
  const q = query.replace(/\s+/g, " ").trim().slice(0, 30);
  return `${program} · ${q}`.slice(0, MAX_LABEL);
}

/* Shape check for NCBI BLAST JSON2 results: exactly what the results view reads. */
const hspSchema = z.object({
  score: z.number(),
  evalue: z.number(),
  identity: z.number(),
  align_len: z.number(),
  qseq: z.string(),
  hseq: z.string(),
  midline: z.string(),
  query_from: z.number(),
  query_to: z.number(),
  hit_from: z.number(),
  hit_to: z.number(),
});

const hitSchema = z.object({
  description: z.array(
    z.object({
      title: z.string(),
      accession: z.string(),
      sciname: z.string().optional(),
    }),
  ),
  hsps: z.array(hspSchema),
});

export const ncbiResultsSchema = z.object({
  BlastOutput2: z
    .array(
      z.object({
        report: z.object({
          results: z.object({
            search: z.object({
              query_len: z.number().optional(),
              hits: z.array(hitSchema).optional(),
            }),
          }),
        }),
      }),
    )
    .min(1),
});

/* POST body. `results` is checked separately so the original object is stored untouched. */
export const saveBodySchema = z.object({
  label: z.string().trim().max(MAX_LABEL, `Label must be at most ${MAX_LABEL} characters.`).optional(),
  rid: z
    .string()
    .trim()
    .min(1, "Missing RID.")
    .max(64)
    .regex(/^[A-Za-z0-9_-]+$/, "Invalid RID."),
  program: z.enum(PROGRAMS),
  database: z.string().trim().min(1).max(32),
  entrezQuery: z.string().max(500).default(""),
  evalue: z.union([z.number(), z.string()]).transform((v) => String(v).trim()).pipe(
    z.string().min(1).max(32).regex(/^[0-9.eE+-]+$/, "Invalid e-value."),
  ),
  hitlistSize: z.coerce.number().int().min(1).max(5000),
  querySequence: z
    .string()
    .min(1, "Missing query sequence.")
    .max(MAX_QUERY_CHARS, `Query sequence is too long (max ${MAX_QUERY_CHARS.toLocaleString("en-US")} characters).`),
  results: z.unknown(),
});

export const renameSchema = z.object({
  label: z.string().trim().min(1, "Label can't be empty.").max(MAX_LABEL, `Label must be at most ${MAX_LABEL} characters.`),
});

export const idSchema = z.string().uuid();

export type ResultSummary = { numHits: number; bestHitTitle: string | null; bestEvalue: string | null };

/** Computed on the server from the validated results (never trusted from the client). */
export function summarize(results: z.infer<typeof ncbiResultsSchema>): ResultSummary {
  const hits = results.BlastOutput2[0]?.report.results.search.hits ?? [];
  let best: { title: string; evalue: number } | null = null;
  for (const hit of hits) {
    const hsp = hit.hsps[0];
    if (!hsp) continue;
    if (!best || hsp.evalue < best.evalue) {
      best = { title: hit.description[0]?.title ?? "", evalue: hsp.evalue };
    }
  }
  return {
    numHits: hits.length,
    bestHitTitle: best ? best.title.slice(0, 500) : null,
    bestEvalue: best ? String(best.evalue) : null,
  };
}
