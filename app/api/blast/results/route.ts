import { NextRequest, NextResponse } from "next/server";

/*
 * Successfully fetched results are cached per RID for 10 minutes so reloads,
 * extra tabs and the Save button never re-download them from NCBI.
 * Concurrent requests for the same RID share one NCBI call.
 */
const RESULTS_TTL_MS = 10 * 60_000;
const MAX_ENTRIES = 50; // results can be large; keep memory bounded
type Entry = { data: unknown; at: number };
const g = globalThis as unknown as {
  __blastResultsCache?: Map<string, Entry>;
  __blastResultsInflight?: Map<string, Promise<unknown>>;
};
const cache = (g.__blastResultsCache ??= new Map());
const inflight = (g.__blastResultsInflight ??= new Map());

async function fetchResultsFromNcbi(rid: string): Promise<unknown> {
  // NCBI returns FORMAT_TYPE=JSON2 as a zip archive; JSON2_S returns the
  // unzipped single-query JSON we can parse directly.
  const url = `https://blast.ncbi.nlm.nih.gov/blast/Blast.cgi?CMD=Get&FORMAT_TYPE=JSON2_S&RID=${rid}&HITLIST_SIZE=50&FORMAT_OBJECT=Alignment`;

  const res = await fetch(url, {
    headers: {
      "User-Agent": "DB2-DungBeetleDatabase/1.0 (pld59@msstate.edu)",
    },
    cache: "no-store",
  });

  return res.json();
}

function isSuccessful(data: unknown): boolean {
  return Array.isArray((data as { BlastOutput2?: unknown })?.BlastOutput2);
}

export async function GET(request: NextRequest) {
  const rid = request.nextUrl.searchParams.get("rid");
  if (!rid) return NextResponse.json({ error: "No RID" }, { status: 400 });
  if (!/^[A-Za-z0-9_-]{1,64}$/.test(rid)) return NextResponse.json({ error: "Invalid RID" }, { status: 400 });

  const hit = cache.get(rid);
  if (hit && Date.now() - hit.at < RESULTS_TTL_MS) return NextResponse.json(hit.data);

  let pending = inflight.get(rid);
  if (!pending) {
    pending = fetchResultsFromNcbi(rid)
      .then((data) => {
        console.info(`[ncbi] ${new Date().toISOString()} results RID=${rid} → ${isSuccessful(data) ? "ok" : "not ready / error"}`);
        if (isSuccessful(data)) {
          cache.set(rid, { data, at: Date.now() });
          // Evict expired entries, then the oldest, to stay within MAX_ENTRIES.
          for (const [k, v] of cache) if (Date.now() - v.at >= RESULTS_TTL_MS) cache.delete(k);
          while (cache.size > MAX_ENTRIES) cache.delete(cache.keys().next().value as string);
        }
        return data;
      })
      .finally(() => inflight.delete(rid));
    inflight.set(rid, pending);
  }

  const data = await pending;
  return NextResponse.json(data);
}
