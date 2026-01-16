"use client";

import React, { useEffect, useState } from "react";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import styles from "./PdfViewer.module.css";
import { usePdf } from "@/context/PdfContext";
import { buildFileUrl, toRelativePath, isBooklistPath } from "@/lib/cdn-utils";

// Worker candidate from CDN or public fonts (checked at runtime)
const defaultWorkerCandidate = buildFileUrl("fonts/pdf.worker.min.js");
const PDFJS_FALLBACK_WORKER = "https://unpkg.com/pdfjs-dist@3.6.172/build/pdf.worker.min.js"; // conservative fallback



export default function PdfViewer() {
  const { files, activeFile, setActive, removeFile } = usePdf();
  const [theme, setTheme] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return "light";
  });

  const [workerUrlState, setWorkerUrlState] = useState<string | undefined>(defaultWorkerCandidate);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(defaultWorkerCandidate, { method: "HEAD" });
        if (!cancelled && res.ok) {
          setWorkerUrlState(defaultWorkerCandidate);
          return;
        }
      } catch (e) {
        // ignore
      }

      // Try fallback
      try {
        const res2 = await fetch(PDFJS_FALLBACK_WORKER, { method: "HEAD" });
        if (!cancelled && res2.ok) {
          setWorkerUrlState(PDFJS_FALLBACK_WORKER);
          return;
        }
      } catch (e) {
        // ignore
      }

      if (!cancelled) setWorkerUrlState(undefined);
    })();

    return () => {
      cancelled = true;
    };
  }, []);


	useEffect(() => {
		if (typeof window !== "undefined") {
			const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = (e: MediaQueryListEvent) => {
        setTheme(e.matches ? "dark" : "light");
      };

      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, []);

  const defaultLayoutPluginInstance = defaultLayoutPlugin({
    sidebarTabs: () => [],
    renderToolbar: (Toolbar) => (
      <Toolbar>
        {(slots: unknown) => {
          const s = slots as Record<string, React.ComponentType<unknown>>;
          const CurrentPageInput = s.CurrentPageInput as React.ComponentType<unknown>;
          const GoToNextPage = s.GoToNextPage as React.ComponentType<unknown>;
          const GoToPreviousPage = s.GoToPreviousPage as React.ComponentType<unknown>;
          const ShowSearchPopover = s.ShowSearchPopover as React.ComponentType<unknown>;
          const Zoom = s.Zoom as React.ComponentType<unknown>;
          const ZoomIn = s.ZoomIn as React.ComponentType<unknown>;
          const ZoomOut = s.ZoomOut as React.ComponentType<unknown>;
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
        {activePdf && (
          (workerUrlState ? (
            <Worker workerUrl={workerUrlState}>
              <div
                style={{
                  height: "100%",
                  width: "100%",
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
              >
                <Viewer
                  fileUrl={buildFileUrl(activePdf.url)}
                  plugins={[defaultLayoutPluginInstance]}
                  theme={theme}
                />
              </div>
            </Worker>
          ) : (
            <div
              style={{
                height: "100%",
                width: "100%",
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              <Viewer
                fileUrl={buildFileUrl(activePdf.url)}
                plugins={[defaultLayoutPluginInstance]}
                theme={theme}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
