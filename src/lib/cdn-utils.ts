export const CDN_BASE =
  process.env.NEXT_PUBLIC_CDN_BASE || "https://wace.jdqc.dev/cdn/";

export const TEXTBOOKS_DIR = "textbooks";
export const BOOKLIST_PATH = "Perth Mod Booklist Year 11 2026.pdf";

export function buildFileUrl(relativePath: string): string {
  const clean = String(relativePath || "").replace(/^\/+/, "");
  if (!clean) return CDN_BASE;

  const segments = clean.split("/").map(encodeURIComponent);
  return `${CDN_BASE.replace(/\/+$/, "")}/${segments.join("/")}`;
}

export function toRelativePath(url: string): string {
  if (!url) return url;
  return url.replace(/^https?:\/\/[^/]+\/cdn\//, "").replace(/^\/+/, "");
}

export function isBooklistPath(url: string): boolean {
  return toRelativePath(url) === BOOKLIST_PATH;
}
