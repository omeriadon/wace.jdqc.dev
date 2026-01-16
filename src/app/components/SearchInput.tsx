"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useCallback, useRef, useEffect } from "react";
import styles from "../textbooks/Textbook.module.css";
import { SearchIcon } from "./Icons";

function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number,
) {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  const debounced = (...args: Parameters<T>) => {
    if (timeout !== null) clearTimeout(timeout as number);
    timeout = setTimeout(() => func(...args), wait);
  };
  debounced.cancel = () => {
    if (timeout !== null) {
      clearTimeout(timeout as number);
      timeout = null;
    }
  };
  return debounced as ((...args: Parameters<T>) => void) & {
    cancel: () => void;
  };
}

export default function SearchInput() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useCallback(
    (term: string) => {
      const params = new URLSearchParams(searchParams);
      if (term) {
        params.set("q", term);
      } else {
        params.delete("q");
      }
      replace(`${pathname}?${params.toString()}`);
    },
    [searchParams, pathname, replace],
  );

  const debouncedRef = useRef<
    (((term: string) => void) & { cancel?: () => void }) | null
  >(null);

  useEffect(() => {
    debouncedRef.current?.cancel?.();
    debouncedRef.current = debounce(handleSearch, 300);
    return () => debouncedRef.current?.cancel?.();
  }, [handleSearch]);

  return (
    <div className={styles.searchContainer}>
      <div className={styles.searchWrapper}>
        <input
          className={styles.searchInput}
          placeholder="Search textbooks..."
          onChange={(e) => debouncedRef.current?.(e.target.value)}
          defaultValue={searchParams.get("q")?.toString()}
        />
        <SearchIcon className={styles.searchIcon} width={20} height={20} />
      </div>
    </div>
  );
}
