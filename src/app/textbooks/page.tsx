export const dynamic = "force-dynamic";
export const revalidate = 0;

import fs from "fs";
import path from "path";
import styles from "./Textbook.module.css";
import FileList from "../components/FileList";
import SearchInput from "../components/SearchInput";
import TransitionWrapper from "../components/TransitionWrapper";
import TextbookHeader from "./components/TextbookHeader";
import TextbookNotes from "./components/TextbookNotes";
import { formatName, formatSize } from "@/lib/textbook-utils";

interface FileItem {
	name: string;
	isDirectory: boolean;
	path: string;
	displayName: string;
	size: string;
}

async function getFolderSize(dirPath: string): Promise<number> {
	let totalSize = 0;
	try {
		const entries = await fs.promises.readdir(dirPath, {
			withFileTypes: true,
		});

		for (const entry of entries) {
			const entryPath = path.join(dirPath, entry.name);
			if (entry.isDirectory()) {
				totalSize += await getFolderSize(entryPath);
			} else {
				const stats = await fs.promises.stat(entryPath);
				totalSize += stats.size;
			}
		}
	} catch (e) {
		// console.error(`Error calculating size for ${dirPath}:`, e);
		return 0;
	}
	return totalSize;
}

async function searchFiles(
	dir: string,
	query: string,
	baseDir: string,
): Promise<FileItem[]> {
	let results: FileItem[] = [];
	try {
		const entries = await fs.promises.readdir(dir, { withFileTypes: true });

		for (const entry of entries) {
			if (entry.name.startsWith(".")) continue;

			const fullPath = path.join(dir, entry.name);
			const relativePath = path.relative(baseDir, fullPath);
			const isMatch = entry.name.toLowerCase().includes(query.toLowerCase());

			if (entry.isDirectory()) {
				const subResults = await searchFiles(fullPath, query, baseDir);
				results = [...results, ...subResults];

				if (isMatch) {
					const folderSize = await getFolderSize(fullPath);
					results.push({
						name: entry.name,
						isDirectory: true,
						path: relativePath,
						displayName: formatName(entry.name),
						size: formatSize(folderSize),
					});
				}
			} else {
				if (entry.name.startsWith("note") && entry.name.endsWith(".txt"))
					continue;

				if (isMatch) {
					const stats = await fs.promises.stat(fullPath);
					results.push({
						name: entry.name,
						isDirectory: false,
						path: relativePath,
						displayName: formatName(entry.name),
						size: formatSize(stats.size),
					});
				}
			}
		}
	} catch (e) {
		console.error(`Error searching ${dir}:`, e);
	}
	return results;
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

	const baseDir = path.join(process.cwd(), "public", "TEXTBOOKS");
	const fullPath = path.join(baseDir, safePath);

	let items: FileItem[] = [];
	let noteContents: string[] = [];
	let error: string | null = null;

	if (query) {
		items = await searchFiles(baseDir, query, baseDir);
	} else {
		try {
			await fs.promises.access(fullPath);

			const dirEntries = await fs.promises.readdir(fullPath, {
				withFileTypes: true,
			});

			const noteFiles = dirEntries.filter(
				(d) =>
					d.isFile() && d.name.startsWith("note") && d.name.endsWith(".txt"),
			);

			if (noteFiles.length > 0) {
				noteFiles.sort((a, b) =>
					a.name.localeCompare(b.name, undefined, {
						numeric: true,
						sensitivity: "base",
					}),
				);

				noteContents = await Promise.all(
					noteFiles.map((f) =>
						fs.promises.readFile(path.join(fullPath, f.name), "utf-8"),
					),
				);
			}
			const noteFileNames = new Set(noteFiles.map((f) => f.name));
			const filteredEntries = dirEntries.filter(
				(d) => !noteFileNames.has(d.name) && !d.name.startsWith("."),
			);

			items = await Promise.all(
				filteredEntries.map(async (d) => {
					const isDirectory = d.isDirectory();
					const childPath = safePath ? path.join(safePath, d.name) : d.name;
					let size = "";

					if (!isDirectory) {
						const stats = await fs.promises.stat(path.join(fullPath, d.name));
						size = formatSize(stats.size);
					} else {
						try {
							const folderSize = await getFolderSize(
								path.join(fullPath, d.name),
							);
							size = formatSize(folderSize);
						} catch (e) {
							size = "Unknown";
						}
					}
					return {
						name: d.name,
						isDirectory,
						path: childPath,
						displayName: formatName(d.name),
						size,
					};
				}),
			);

			// Deduplicate items based on displayName to avoid case-sensitivity issues
			const uniqueItems = new Map<string, FileItem>();
			for (const item of items) {
				if (!item.name.startsWith(".")) {
					// Use lowercased display name as key to ensure case-insensitive deduplication
					const key = item.displayName.toLowerCase();
					if (!uniqueItems.has(key)) {
						uniqueItems.set(key, item);
					}
				}
			}
			items = Array.from(uniqueItems.values());
		} catch (e) {
			error = "Directory not found or empty.";
		}
	}

	items.sort((a, b) => {
		if (a.isDirectory === b.isDirectory) return a.name.localeCompare(b.name);
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
