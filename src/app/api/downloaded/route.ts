export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";

const EXTERNAL_API = "http://203.17.177.58:4167";

export async function POST() {
	try {
		const res = await fetch(`${EXTERNAL_API}/downloaded`, { method: "POST" });
		const text = await res.text();
		const count = parseInt(text, 10);
		console.log("downloaded increment");

		return NextResponse.json({ count });
	} catch (error) {
		console.error("Error incrementing download count:", error);
		return NextResponse.json({ count: 0 }, { status: 500 });
	}
}
