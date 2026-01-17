"use client";

import React, { useState } from "react";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import styles from "./PdfViewer.module.css";
import { usePdf } from "@/context/PdfContext";
import { buildFileUrl, toRelativePath, isBooklistPath } from "@/lib/cdn-utils";

export default function PdfViewer() {
  const { files, activeFile, setActive, removeFile } = usePdf();
  const [theme] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    return "light";
  });

  const defaultLayoutPluginInstance = defaultLayoutPlugin({
    sidebarTabs: () => [],
    renderToolbar: (Toolbar) => (
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
              style={{ display: "flex", alignItems: "center", width: "100%" }}
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

  const activePdf =
    files.find(
      (f) => toRelativePath(f.url) === toRelativePath(activeFile || ""),
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
            <span className={styles.tabName} title={file.name}>
              {file.name}
            </span>
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
        <Worker workerUrl="/pdf.worker.min.js">
          <div style={{ height: "100%", width: "100%" }}>
            <Viewer
              fileUrl={buildFileUrl(activePdf.url)}
              plugins={[defaultLayoutPluginInstance]}
              theme={theme}
            />
          </div>
        </Worker>
      </div>
    </div>
  );
}
