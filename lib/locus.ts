/*
 * Locus strings for the genome browser, shared by server validation and the
 * client (?loc= links, saving the current view). No dependencies.
 *
 * Accepted: <refName>:<start>-<end> or <refName>:<start>..<end>
 *   refName: letters, digits, _ . | -   (e.g. NC_091970.1, chr1, scaffold_12)
 *   start/end: positive integers, start <= end
 * JBrowse displays numbers with thousands separators ("chr1:1,000..2,000"), so
 * commas and spaces are stripped before checking.
 */
export const MAX_LOCUS_LENGTH = 200;
const LOCUS_RE = /^([A-Za-z0-9_.|-]{1,120}):(\d{1,12})(?:-|\.\.)(\d{1,12})$/;

/** Returns the canonical "ref:start..end" form, or null if it isn't a safe single-region locus. */
export function normalizeLocus(input: string | null | undefined): string | null {
  if (typeof input !== "string") return null;
  const compact = input.replace(/[,\s]/g, "");
  if (compact.length === 0 || compact.length > MAX_LOCUS_LENGTH) return null;
  const m = LOCUS_RE.exec(compact);
  if (!m) return null;
  const start = Number(m[2]);
  const end = Number(m[3]);
  if (start < 1 || end < start) return null;
  return `${m[1]}:${start}..${end}`;
}
