export const CDN_BASE =
  process.env.NEXT_PUBLIC_CDN_BASE || "https://wace.jdqc.dev/cdn/";

export const TEXTBOOKS_DIR = "textbooks";
export const BOOKLIST_PATH = "Perth Mod Booklist Year 11 2026.pdf";

/**
 * Build the full URL for a PDF or file under CDN.
 * All files (including Booklist) are served from /cdn/.
 */
export function buildFileUrl(relativePath: string): string {
  const clean = String(relativePath || "").replace(/^\/+/, "");
  if (!clean) return CDN_BASE;

  // Always serve from CDN
  return `${CDN_BASE.replace(/\/+$/, "")}/${encodeURIComponent(clean)}`;
}

/**
 * Get relative path from a full CDN URL
 */
export function toRelativePath(url: string): string {
  if (!url) return url;
  return url.replace(/^https?:\/\/[^/]+\/cdn\//, "").replace(/^\/+/, "");
}

/**
 * Check if the file is the Booklist
 */
export function isBooklistPath(url: string): boolean {
  return toRelativePath(url) === BOOKLIST_PATH;
}
