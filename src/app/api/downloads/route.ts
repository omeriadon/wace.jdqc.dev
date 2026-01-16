export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";

const EXTERNAL_API = "http://203.17.177.58:4167";

export async function GET() {
  try {
    console.log("/api/downloads: proxying to external API", { url: `${EXTERNAL_API}/downloads` });
    const res = await fetch(`${EXTERNAL_API}/downloads`, { cache: "no-store" });
    const text = await res.text();
    console.log("/api/downloads: response", { ok: res.ok, status: res.status, body: text });
    const count = parseInt(text, 10);

    return NextResponse.json({ count });
  } catch (error) {
    console.error("Error fetching download count:", error);
    return NextResponse.json({ count: 0 });
  }
}
