export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";

const EXTERNAL_API = "http://203.17.177.58:4167";

export async function POST() {
  try {
    console.log("/api/visit POST: proxying to external API", {
      url: `${EXTERNAL_API}/increment`,
    });
    const res = await fetch(`${EXTERNAL_API}/increment`, { method: "POST" });
    const text = await res.text();
    console.log("/api/visit POST: response", {
      ok: res.ok,
      status: res.status,
      body: text,
    });
    const count = parseInt(text, 10);

    return NextResponse.json({ count });
  } catch (error) {
    console.error("Error incrementing visitor count:", error);
    return NextResponse.json({ count: 0 }, { status: 500 });
  }
}

export async function GET() {
  try {
    console.log("/api/visit GET: proxying to external API", {
      url: `${EXTERNAL_API}/visitors`,
    });
    const res = await fetch(`${EXTERNAL_API}/visitors`, { cache: "no-store" });
    const text = await res.text();
    console.log("/api/visit GET: response", {
      ok: res.ok,
      status: res.status,
      body: text,
    });
    const count = parseInt(text, 10);

    return NextResponse.json({ count });
  } catch (error) {
    console.error("Error fetching visitor count:", error);
    return NextResponse.json({ count: 0 });
  }
}
