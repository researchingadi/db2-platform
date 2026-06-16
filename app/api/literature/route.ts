import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const query =
    request.nextUrl.searchParams.get("query") || "dung beetle Onthophagus";

  const url = `https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=${encodeURIComponent(query)}&format=json&pageSize=25&sort=cited&resultType=core`;

  try {
    const res = await fetch(url, {
      headers: { "Accept": "application/json" },
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Europe PMC API error" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch literature" },
      { status: 500 }
    );
  }
}
