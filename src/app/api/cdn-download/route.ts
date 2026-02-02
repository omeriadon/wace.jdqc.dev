export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { buildFileUrl } from "@/lib/cdn-utils";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const cdnPath = searchParams.get("cdnPath");

  console.log("/api/cdn-download incoming", { cdnPath });

  if (!cdnPath) {
    return new NextResponse("Missing cdnPath parameter", { status: 400 });
  }

  try {
    // Fetch the file from CDN
    const fileUrl = buildFileUrl(cdnPath);
    console.log("/api/cdn-download fetching", { fileUrl });

    const response = await fetch(fileUrl);

    if (!response.ok) {
      console.error("/api/cdn-download fetch failed", {
        status: response.status,
        statusText: response.statusText,
      });
      return new NextResponse("File not found", { status: 404 });
    }

    // Get the filename from the path
    const filename = cdnPath.split("/").pop() || "download";

    console.log("/api/cdn-download streaming", {
      filename,
      contentType: response.headers.get("Content-Type"),
    });

    // Stream the response directly instead of loading into memory
    return new NextResponse(response.body, {
      headers: {
        "Content-Type":
          response.headers.get("Content-Type") || "application/octet-stream",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": response.headers.get("Content-Length") || "",
      },
    });
  } catch (error) {
    console.error("CDN download error:", error);
    return new NextResponse("Download failed", { status: 500 });
  }
}
