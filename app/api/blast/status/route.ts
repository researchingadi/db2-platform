import { NextRequest, NextResponse } from "next/server";

/*
 * NCBI usage policy: don't poll a RID before its estimated time (RTOE), then
 * at most once per minute. For RIDs submitted through this server, requests
 * before submit + RTOE get WAITING without contacting NCBI. The last status
 * from NCBI is cached per RID for 60 s; any request inside that window (other
 * tabs, reloads, impatient clients) gets the cached value without contacting
 * NCBI. Concurrent requests for the same RID share one NCBI call.
 */
const STATUS_TTL_MS = 60_000;
const MAX_ENTRIES = 2_000;
type Entry = { status: string; at: number };
const g = globalThis as unknown as {
  __blastStatusCache?: Map<string, Entry>;
  __blastStatusInflight?: Map<string, Promise<string>>;
  // Set by /api/blast/submit: RID → earliest time NCBI may be polled (submit + RTOE).
  __blastEarliestPoll?: Map<string, number>;
};
const cache = (g.__blastStatusCache ??= new Map());
const inflight = (g.__blastStatusInflight ??= new Map());
const earliestPoll = (g.__blastEarliestPoll ??= new Map());

async function fetchStatusFromNcbi(rid: string): Promise<string> {
  const url = `https://blast.ncbi.nlm.nih.gov/blast/Blast.cgi?CMD=Get&FORMAT_OBJECT=SearchInfo&RID=${rid}&FORMAT_TYPE=JSON2`;

  const res = await fetch(url, {
    headers: {
      "User-Agent": "DB2-DungBeetleDatabase/1.0 (pld59@msstate.edu)",
    },
    cache: "no-store",
  });

  const text = await res.text();

  if (text.includes("Status=WAITING")) return "WAITING";
  if (text.includes("Status=READY")) return "READY";
  if (text.includes("Status=FAILED")) return "FAILED";
  if (text.includes("Status=UNKNOWN")) return "UNKNOWN";
  return "WAITING";
}

export async function GET(request: NextRequest) {
  const rid = request.nextUrl.searchParams.get("rid");
  if (!rid) return NextResponse.json({ error: "No RID" }, { status: 400 });
  if (!/^[A-Za-z0-9_-]{1,64}$/.test(rid)) return NextResponse.json({ error: "Invalid RID" }, { status: 400 });

  const now = Date.now();
  // Before the RTOE has passed, don't ask NCBI at all (NCBI policy).
  const notBefore = earliestPoll.get(rid);
  if (notBefore && now < notBefore) {
    return NextResponse.json({ status: "WAITING", cached: true });
  }
  const hit = cache.get(rid);
  if (hit && now - hit.at < STATUS_TTL_MS) {
    return NextResponse.json({ status: hit.status, cached: true });
  }

  let pending = inflight.get(rid);
  if (!pending) {
    pending = fetchStatusFromNcbi(rid)
      .then((status) => {
        console.info(`[ncbi] ${new Date().toISOString()} status RID=${rid} → ${status}`);
        cache.set(rid, { status, at: Date.now() });
        if (cache.size > MAX_ENTRIES) {
          for (const [k, v] of cache) if (Date.now() - v.at >= STATUS_TTL_MS) cache.delete(k);
        }
        return status;
      })
      .finally(() => inflight.delete(rid));
    inflight.set(rid, pending);
  }

  try {
    const status = await pending;
    return NextResponse.json({ status });
  } catch {
    // Network trouble reaching NCBI: report WAITING so the client simply tries again next minute.
    return NextResponse.json({ status: "WAITING" });
  }
}
