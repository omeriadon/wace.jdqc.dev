export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import archiver from "archiver";
import { checkRateLimit } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";
  const isAllowed = checkRateLimit(ip, 1000, 60 * 60 * 1000);

  if (!isAllowed) {
    return NextResponse.redirect(new URL("/rate-limit", request.url));
  }

  const searchParams = request.nextUrl.searchParams;
  const relativePath = searchParams.get("path") || "";
  const isPreview = searchParams.get("preview") === "true";

  const safePath = relativePath.replace(/\.\./g, "");
  const TEXTBOOKS_DIR = process.env.TEXTBOOKS_DIR_NAME || "textbooks";
  const baseDir = path.join(process.cwd(), "public", TEXTBOOKS_DIR);
  const fullPath = path.join(baseDir, safePath);

  console.log("/api/download incoming", { ip, relativePath, safePath, isPreview, TEXTBOOKS_DIR, baseDir, fullPath });

  try {
    await fs.promises.access(fullPath);
    const stats = await fs.promises.stat(fullPath);

    if (!stats.isDirectory()) {
      const fileStream = fs.createReadStream(fullPath);
      const stream = new ReadableStream({
        start(controller) {
          fileStream.on("data", (chunk) => controller.enqueue(chunk));
          fileStream.on("end", () => controller.close());
          fileStream.on("error", (err) => controller.error(err));
        },
      });

      const contentType =
        path.extname(safePath).toLowerCase() === ".pdf"
          ? "application/pdf"
          : "application/octet-stream";

      return new NextResponse(stream, {
        headers: {
          "Content-Type": contentType,
          "Content-Disposition": `${
            isPreview ? "inline" : "attachment"
          }; filename="${path.basename(safePath)}"`,
        },
      });
    }

    const archive = archiver("zip", {
      zlib: { level: 9 },
    });

    const stream = new ReadableStream({
      start(controller) {
        archive.on("data", (chunk) => {
          controller.enqueue(chunk);
        });
        archive.on("end", () => {
          controller.close();
        });
        archive.on("error", (err) => {
          controller.error(err);
        });

        archive.directory(fullPath, false);
        archive.finalize();
      },
    });

    const filename = path.basename(safePath) || "textbooks";

    return new NextResponse(stream, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${filename}.zip"`,
      },
    });
  } catch (error) {
    console.error("Download error:", error);
    return new NextResponse("Directory not found", { status: 404 });
  }
}
