export function formatSize(bytes: number): string {
	if (bytes === 0) return "0 B";
	const k = 1024;
	const sizes = ["B", "KB", "MB", "GB", "TB"];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

export function formatName(name: string): string {
	const nameWithoutExt = name.replace(/\.[^/.]+$/, "");

	// // Special case for "English & Literature" to avoid duplicates if user has "English + Lit" or similar
	// if (
	// 	nameWithoutExt.toLowerCase().includes("english") &&
	// 	nameWithoutExt.toLowerCase().includes("lit")
	// ) {
	// 	return "English & Literature";
	// }

	// // Special case for WA Drama to merge duplicates
	// if (
	// 	nameWithoutExt.toLowerCase().includes("wa drama") &&
	// 	nameWithoutExt.toLowerCase().includes("year 11") &&
	// 	nameWithoutExt.toLowerCase().includes("year 12")
	// ) {
	// 	return "WA Drama Year 11 + 12 ATAR";
	// }

	// // Special case for The Australian Biology Dictionary
	// if (
	// 	nameWithoutExt.toLowerCase().includes("the australian biology dictionary")
	// ) {
	// 	return "The Australian Biology Dictionary - Ruth Miller, David Heffernan";
	// }

	// Replace underscores with spaces and remove duplicate suffixes like (1)
	const cleanedName = nameWithoutExt
		.replace(/_/g, " ")
		.replace(/\s\(\d+\)$/, "");

	// Capitalize the first letter of each word
	return cleanedName.replace(/\b\w/g, (l) => l.toUpperCase());
}
