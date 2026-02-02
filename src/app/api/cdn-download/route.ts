export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { buildFileUrl } from "@/lib/cdn-utils";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const cdnPath = searchParams.get("cdnPath");

  if (!cdnPath) {
    return new NextResponse("Missing cdnPath parameter", { status: 400 });
  }

  try {
    // Fetch the file from CDN
    const fileUrl = buildFileUrl(cdnPath);
    const response = await fetch(fileUrl);

    if (!response.ok) {
      return new NextResponse("File not found", { status: 404 });
    }

    // Get the filename from the path
    const filename = cdnPath.split("/").pop() || "download";

    // Create a new response with download headers
    const fileBlob = await response.blob();

    return new NextResponse(fileBlob, {
      headers: {
        "Content-Type":
          response.headers.get("Content-Type") || "application/octet-stream",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": fileBlob.size.toString(),
      },
    });
  } catch (error) {
    console.error("CDN download error:", error);
    return new NextResponse("Download failed", { status: 500 });
  }
}
