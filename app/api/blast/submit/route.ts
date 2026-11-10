import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";

/*
 * NCBI usage policy: no rapid bursts. Submissions to NCBI from this server are
 * spaced at least 10 s apart (server-wide), and each client IP may submit at
 * most 5 searches per 10 minutes. Both limits are in memory (per server process).
 */
const MIN_SPACING_MS = 10_000;
const PER_IP_MAX = 5;
const PER_IP_WINDOW_S = 600;
const MIN_FIRST_POLL_S = 15;
const g = globalThis as unknown as {
  __blastLastSubmitAt?: number;
  // Shared with /api/blast/status: RID → earliest time NCBI may be polled (submit + RTOE).
  __blastEarliestPoll?: Map<string, number>;
};
const earliestPoll = (g.__blastEarliestPoll ??= new Map());

function clientIp(request: NextRequest): string {
  const fwd = request.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? request.ip ?? "unknown";
}

function tooMany(message: string, retryAfter: number) {
  return NextResponse.json(
    { error: message, retryAfter },
    { status: 429, headers: { "Retry-After": String(retryAfter) } },
  );
}

export async function POST(request: NextRequest) {
  const { sequence, program, database, entrezQuery, evalue, hitlistSize } =
    await request.json();

  // 1. Server-wide spacing (checked first so a blocked attempt doesn't use up the user's quota).
  const now = Date.now();
  const sinceLast = now - (g.__blastLastSubmitAt ?? 0);
  if (sinceLast < MIN_SPACING_MS) {
    const wait = Math.ceil((MIN_SPACING_MS - sinceLast) / 1000);
    return tooMany(
      `The BLAST service is busy with another search. Please try again in ${wait} second${wait === 1 ? "" : "s"}.`,
      wait,
    );
  }

  // 2. Per-IP quota.
  const limit = rateLimit(`blast-submit:${clientIp(request)}`, PER_IP_MAX, PER_IP_WINDOW_S);
  if (!limit.ok) {
    const minutes = Math.max(1, Math.ceil(limit.retryAfter / 60));
    return tooMany(
      `You've started ${PER_IP_MAX} BLAST searches in the last 10 minutes, the most allowed. Please try again in about ${minutes} minute${minutes === 1 ? "" : "s"}.`,
      limit.retryAfter,
    );
  }

  g.__blastLastSubmitAt = now; // set before awaiting so concurrent requests see it

  const params = new URLSearchParams({
    CMD: "Put",
    PROGRAM: program,
    DATABASE: database,
    QUERY: sequence,
    ENTREZ_QUERY: entrezQuery,
    HITLIST_SIZE: String(hitlistSize || 50),
    EXPECT: String(evalue || 0.001),
    FORMAT_TYPE: "JSON2",
    WORD_SIZE: program === "blastp" ? "3" : "11",
    FILTER: "L",
    TOOL: "db2-dung-beetle-database",
    EMAIL: "pld59@msstate.edu",
  });

  const res = await fetch("https://blast.ncbi.nlm.nih.gov/blast/Blast.cgi", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": "DB2-DungBeetleDatabase/1.0 (pld59@msstate.edu)",
    },
    body: params.toString(),
    cache: "no-store",
  });

  const text = await res.text();

  const ridMatch = text.match(/RID = (\S+)/);
  const rtoeMatch = text.match(/RTOE = (\d+)/);

  console.info(
    `[ncbi] ${new Date().toISOString()} submit → RID=${ridMatch?.[1] ?? "none"} RTOE=${rtoeMatch?.[1] ?? "?"}`,
  );

  if (!ridMatch) {
    return NextResponse.json(
      { error: "Failed to submit BLAST job. NCBI did not return a RID." },
      { status: 500 }
    );
  }

  const estimatedSeconds = rtoeMatch ? parseInt(rtoeMatch[1]) : 60;
  // Nobody (any tab, any client) may make the server poll NCBI for this RID before its RTOE.
  earliestPoll.set(ridMatch[1], Date.now() + Math.max(MIN_FIRST_POLL_S, estimatedSeconds) * 1000);
  if (earliestPoll.size > 2_000) {
    for (const [k, t] of earliestPoll) if (t < Date.now() - 3_600_000) earliestPoll.delete(k);
  }

  return NextResponse.json({
    rid: ridMatch[1],
    estimatedSeconds,
  });
}
