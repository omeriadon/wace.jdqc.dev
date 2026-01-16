export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";

const EXTERNAL_API = "http://203.17.177.58:4167";

export async function GET() {
	try {
		const res = await fetch(`${EXTERNAL_API}/downloads`, { cache: "no-store" });
		const text = await res.text();
		const count = parseInt(text, 10);
		console.log("downloads fetch");

		return NextResponse.json({ count });
	} catch (error) {
		console.error("Error fetching download count:", error);
		return NextResponse.json({ count: 0 });
	}
}
