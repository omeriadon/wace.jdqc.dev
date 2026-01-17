export const dynamic = "force-dynamic";
export const revalidate = 0;

import styles from "./Textbook.module.css";
import FileList from "../components/FileList";
import SearchInput from "../components/SearchInput";
import TransitionWrapper from "../components/TransitionWrapper";
import TextbookHeader from "./components/TextbookHeader";
import TextbookNotes from "./components/TextbookNotes";
import { formatName, formatSize } from "@/lib/textbook-utils";
import { buildFileUrl } from "@/lib/cdn-utils";

interface FileItem {
  name: string;
  isDirectory: boolean;
  path: string;
  displayName: string;
  size: string;
  cdnPath?: string;
}

async function fetchFromCdn({
  safePath,
  query,
}: {
  safePath: string;
  query?: string;
}): Promise<{
  items: FileItem[];
  noteContents: string[];
  error: string | null;
}> {
  const noteContents: string[] = [];
  let items: FileItem[] = [];
  let error: string | null = null;

  const basePath = `textbooks/${safePath ? safePath + "/" : ""}`;
  const dirUrl = buildFileUrl(basePath);

  try {
    const res = await fetch(dirUrl);
    if (!res.ok) throw new Error("CDN fetch failed");

    const html = await res.text();
    const pre = html.match(/<pre>([\s\S]*?)<\/pre>/i)?.[1];
    if (!pre) throw new Error("No <pre> block");

    const lines = pre.split("\n");

    for (const line of lines) {
      const m = line.match(
        /<a href="([^"]+)">[^<]+<\/a>\s+\d{2}-[A-Za-z]{3}-\d{4}\s+\d{2}:\d{2}\s+(-|\d+)/,
      );
      if (!m) continue;

      const href = decodeURIComponent(m[1]);
      const sizeToken = m[2];

      if (href === "../") continue;

      const isDirectory = sizeToken === "-";
      const name = href.replace(/\/$/, "");

      if (!isDirectory && name.toLowerCase().endsWith(".txt")) {
        const noteRes = await fetch(buildFileUrl(`${basePath}${name}`));
        if (noteRes.ok) {
          noteContents.push(await noteRes.text());
        }
        continue;
      }

      items.push({
        name,
        isDirectory,
        path: safePath ? `${safePath}/${name}` : name,
        cdnPath: `${basePath}${name}`.replace(/\/+$/, ""),
        displayName: formatName(name),
        size: isDirectory ? "" : formatSize(Number(sizeToken)),
      });
    }

    if (query) {
      const q = query.toLowerCase();
      items = items.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.displayName.toLowerCase().includes(q) ||
          i.path.toLowerCase().includes(q),
      );
    }

    const map = new Map<string, FileItem>();
    for (const item of items) {
      const key = item.name.toLowerCase();
      if (!map.has(key)) map.set(key, item);
    }
    items = [...map.values()];
  } catch {
    error = "Directory not found or empty.";
  }

  return { items, noteContents, error };
}

export default async function TextbooksPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;

  const currentPath =
    typeof resolvedSearchParams.path === "string"
      ? resolvedSearchParams.path
      : "";

  const query =
    typeof resolvedSearchParams.q === "string" ? resolvedSearchParams.q : "";

  const safePath = currentPath.replace(/\.\./g, "");

  const { items, noteContents, error } = await fetchFromCdn({
    safePath,
    query,
  });

  items.sort((a, b) => {
    if (a.isDirectory === b.isDirectory) {
      return a.name.localeCompare(b.name);
    }
    return a.isDirectory ? -1 : 1;
  });

  return (
    <div className={styles.container}>
      <TextbookHeader currentPath={currentPath} query={query} />
      {!query && <TextbookNotes noteContents={noteContents} />}
      <SearchInput />
      {error ? (
        <div className={styles.error}>{error}</div>
      ) : (
        <TransitionWrapper>
          {items.length === 0 && (
            <p className={styles.emptyMessage}>
              {query ? "No results found." : "This folder is empty."}
            </p>
          )}
          {items.length > 0 && <FileList items={items} showPath={!!query} />}
        </TransitionWrapper>
      )}
    </div>
  );
}
