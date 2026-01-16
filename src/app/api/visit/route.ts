export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";

const EXTERNAL_API = "http://203.17.177.58:4167";

export async function POST() {
	try {
		const res = await fetch(`${EXTERNAL_API}/increment`, { method: "POST" });
		const text = await res.text();
		const count = parseInt(text, 10);
		console.log("incrment 2");

		return NextResponse.json({ count });
	} catch (error) {
		console.error("Error incrementing visitor count:", error);
		return NextResponse.json({ count: 0 }, { status: 500 });
	}
}

export async function GET() {
	try {
		const res = await fetch(`${EXTERNAL_API}/visitors`, { cache: "no-store" });
		const text = await res.text();
		const count = parseInt(text, 10);
		console.log("visit 2");

		return NextResponse.json({ count });
	} catch (error) {
		console.error("Error fetching visitor count:", error);
		return NextResponse.json({ count: 0 });
	}
}
