"use client";

import styles from "./PdfViewer.module.css";
import { usePdf } from "@/context/PdfContext";
import { buildFileUrl, toRelativePath, isBooklistPath } from "@/lib/cdn-utils";

export default function PdfViewer() {
	const { files, activeFile, setActive, removeFile } = usePdf();

	if (files.length === 0) {
		return <div className={styles.emptyState}>No PDFs open</div>;
	}

	const activePdf =
		files.find(
			(f) => toRelativePath(f.url) === toRelativePath(activeFile || "")
		) || files[0];

	return (
		<div className={styles.container}>
			<div className={styles.tabs}>
				{files.map((file) => (
					<div
						key={file.url}
						className={`${styles.tab} ${
							toRelativePath(file.url) === toRelativePath(activeFile || "")
								? styles.activeTab
								: ""
						}`}
						onClick={() => setActive(file.url)}
					>
						<span className={styles.tabName}>{file.name}</span>
						{!isBooklistPath(file.url) && (
							<button
								className={styles.closeButton}
								onClick={(e) => {
									e.stopPropagation();
									removeFile(file.url);
								}}
							>
								×
							</button>
						)}
					</div>
				))}
			</div>

			<div className={styles.content}>
				<embed
					src={buildFileUrl(activePdf.url)}
					type="application/pdf"
					className={styles.pdf}
				/>
			</div>
		</div>
	);
}
