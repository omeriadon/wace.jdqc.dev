"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useCallback } from "react";
import styles from "../textbooks/Textbook.module.css";
import { SearchIcon } from "../../components/Icons";

function debounce<T extends (...args: any[]) => any>(
	func: T,
	wait: number,
): (...args: Parameters<T>) => void {
	let timeout: NodeJS.Timeout;
	return (...args: Parameters<T>) => {
		clearTimeout(timeout);
		timeout = setTimeout(() => func(...args), wait);
	};
}

export default function SearchInput() {
	const searchParams = useSearchParams();
	const pathname = usePathname();
	const { replace } = useRouter();

	const handleSearch = useCallback(
		debounce((term: string) => {
			const params = new URLSearchParams(searchParams);
			if (term) {
				params.set("q", term);
			} else {
				params.delete("q");
			}
			replace(`${pathname}?${params.toString()}`);
		}, 300),
		[searchParams, pathname, replace],
	);

	return (
		<div className={styles.searchContainer}>
			<div className={styles.searchWrapper}>
				<input
					className={styles.searchInput}
					placeholder="Search textbooks..."
					onChange={(e) => handleSearch(e.target.value)}
					defaultValue={searchParams.get("q")?.toString()}
				/>
				<SearchIcon className={styles.searchIcon} width={20} height={20} />
			</div>
		</div>
	);
}
