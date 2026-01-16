"use client";

import React, { useEffect, useState } from "react";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import styles from "./PdfViewer.module.css";
import { usePdf } from "@/context/PdfContext";

// Use the local worker file
const workerUrl = "/pdf.worker.min.js";

export default function PdfViewer() {
	const { files, activeFile, setActive, removeFile } = usePdf();
	const [theme, setTheme] = useState("light");

	useEffect(() => {
		if (typeof window !== "undefined") {
			const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
			setTheme(mediaQuery.matches ? "dark" : "light");

			const handleChange = (e: MediaQueryListEvent) => {
				setTheme(e.matches ? "dark" : "light");
			};

			mediaQuery.addEventListener("change", handleChange);
			return () => mediaQuery.removeEventListener("change", handleChange);
		}
	}, []);

	const defaultLayoutPluginInstance = defaultLayoutPlugin({
		sidebarTabs: () => [],
		renderToolbar: (Toolbar: any) => (
			<Toolbar>
				{(slots: any) => {
					const {
						CurrentPageInput,
						GoToNextPage,
						GoToPreviousPage,
						ShowSearchPopover,
						Zoom,
						ZoomIn,
						ZoomOut,
					} = slots;
					return (
						<div
							style={{
								alignItems: "center",
								display: "flex",
								width: "100%",
							}}
						>
							<div style={{ padding: "0px 2px" }}>
								<ShowSearchPopover />
							</div>
							<div style={{ padding: "0px 2px" }}>
								<ZoomOut />
							</div>
							<div style={{ padding: "0px 2px" }}>
								<Zoom />
							</div>
							<div style={{ padding: "0px 2px" }}>
								<ZoomIn />
							</div>
							<div style={{ padding: "0px 2px", marginLeft: "auto" }}>
								<GoToPreviousPage />
							</div>
							<div
								style={{
									padding: "0px 2px",
									display: "flex",
									alignItems: "center",
								}}
							>
								<CurrentPageInput />
							</div>
							<div style={{ padding: "0px 2px" }}>
								<GoToNextPage />
							</div>
						</div>
					);
				}}
			</Toolbar>
		),
	});

	if (files.length === 0) {
		return (
			<div className={styles.container}>
				<div className={styles.emptyState}>No PDFs open</div>
			</div>
		);
	}

	const activePdf = files.find((f) => f.url === activeFile) || files[0];

	return (
		<div className={styles.container}>
			<div className={styles.tabs}>
				{files.map((file) => (
					<div
						key={file.url}
						className={`${styles.tab} ${
							file.url === activeFile ? styles.activeTab : ""
						}`}
						onClick={() => setActive(file.url)}
					>
						<span className={styles.tabName} title={file.name}>
							{file.name}
						</span>
						{file.url !== "/Perth Mod Booklist Year 11 2026.pdf" && (
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
				{activePdf && (
					<Worker workerUrl={workerUrl}>
						<div
							style={{
								height: "100%",
								width: "100%",
								marginLeft: "auto",
								marginRight: "auto",
							}}
						>
							<Viewer
								fileUrl={activePdf.url}
								plugins={[defaultLayoutPluginInstance]}
								theme={theme}
							/>
						</div>
					</Worker>
				)}
			</div>
		</div>
	);
}
