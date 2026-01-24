"use client";

import { useRouter } from "next/navigation";
import styles from "../textbooks/Textbook.module.css";
import { FolderIcon, DocumentIcon, DownloadIcon } from "@/app/components/Icons";
import { usePdf } from "@/context/PdfContext";
import { buildFileUrl, CDN_BASE } from "@/lib/cdn-utils";

const EyeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

interface FileItem {
  name: string;
  isDirectory: boolean;
  path: string;
  displayName: string;
  size: string;
  cdnPath?: string;
}

export default function FileRow({
  item,
  showPath = false,
}: {
  item: FileItem;
  showPath?: boolean;
}) {
  const router = useRouter();
  const { addFile } = usePdf();

  const handleRowClick = () => {
    console.log("FileRow: clicked", { item });
    if (item.isDirectory) {
      router.push(`/textbooks?path=${encodeURIComponent(item.path)}`);
    }
  };

  const handleDownload = async () => {
    console.log("FileRow: download clicked", { item });
    try {
      await fetch("/api/downloaded", { method: "POST" });
    } catch (error) {
      console.error("Failed to track download", error);
    }
  };

  const handlePreview = (e: React.MouseEvent) => {
    console.log("FileRow: preview clicked", { item });
    e.stopPropagation();
    const fileUrl =
      CDN_BASE && !item.isDirectory
        ? buildFileUrl(item.cdnPath || item.path)
        : `/api/download?path=${encodeURIComponent(item.path)}&preview=true`;

    addFile({
      name: item.displayName,
      url: fileUrl,
    });
  };

  return (
    <div
      className={`${styles.itemCard} ${
        item.isDirectory ? styles.itemCardLink : ""
      }`}
      onClick={handleRowClick}
    >
      <div className={styles.itemContent}>
        <div className={styles.iconContainer}>
          {item.isDirectory ? (
            <FolderIcon width={24} height={24} className={styles.icon} />
          ) : (
            <DocumentIcon width={24} height={24} className={styles.icon} />
          )}
        </div>
        <div className={styles.textContainer}>
          <span className={styles.itemName}>{item.displayName}</span>
          {showPath && <span className={styles.itemPath}>{item.path}</span>}
        </div>
        <span className={styles.itemSize}>{item.size}</span>
      </div>

      <div className={styles.downloadContainer}>
        {!item.isDirectory && (
          <>
            <button
              className={styles.downloadButton}
              onClick={handlePreview}
              title="Preview"
            >
              <EyeIcon width={16} height={16} className={styles.downloadIcon} />
            </button>

            <a
              href={
                CDN_BASE
                  ? buildFileUrl(item.cdnPath || item.path)
                  : `/api/download?path=${encodeURIComponent(item.path)}`
              }
              className={styles.downloadButton}
              onClick={(e) => {
                e.stopPropagation();
                handleDownload();
              }}
            >
              <DownloadIcon
                width={16}
                height={16}
                className={styles.downloadIcon}
              />
              Download
            </a>
          </>
        )}
      </div>
    </div>
  );
}
