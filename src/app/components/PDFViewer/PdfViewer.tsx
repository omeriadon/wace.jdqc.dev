"use client";

import React, { useEffect, useState } from "react";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import styles from "./PdfViewer.module.css";
import { usePdf } from "@/context/PdfContext";
import { buildFileUrl, toRelativePath, isBooklistPath } from "@/lib/cdn-utils";

const DEFAULT_WORKER = "/pdf.worker.min.js";
const FALLBACK_WORKER =
  "https://unpkg.com/pdfjs-dist@3.6.172/build/pdf.worker.min.js";

export default function PdfViewer() {
  const { files, activeFile, setActive, removeFile } = usePdf();
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [workerUrl, setWorkerUrl] = useState<string | undefined>(
    DEFAULT_WORKER,
  );

  useEffect(() => {
    setMounted(true);

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    setTheme(mq.matches ? "dark" : "light");

    const listener = (e: MediaQueryListEvent) =>
      setTheme(e.matches ? "dark" : "light");
    mq.addEventListener("change", listener);

    return () => mq.removeEventListener("change", listener);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(DEFAULT_WORKER, { method: "HEAD" });
        if (!cancelled && res.ok) {
          setWorkerUrl(DEFAULT_WORKER);
          return;
        }
      } catch {}

      try {
        const res2 = await fetch(FALLBACK_WORKER, { method: "HEAD" });
        if (!cancelled && res2.ok) {
          setWorkerUrl(FALLBACK_WORKER);
          return;
        }
      } catch {}

      if (!cancelled) setWorkerUrl(undefined);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const defaultLayoutPluginInstance = defaultLayoutPlugin({
    sidebarTabs: () => [],
    renderToolbar: (Toolbar) => (
      <Toolbar>
        {(slots: unknown) => {
          const s = slots as Record<string, React.ComponentType<unknown>>;
          const CurrentPageInput =
            s.CurrentPageInput as React.ComponentType<unknown>;
          const GoToNextPage = s.GoToNextPage as React.ComponentType<unknown>;
          const GoToPreviousPage =
            s.GoToPreviousPage as React.ComponentType<unknown>;
          const ShowSearchPopover =
            s.ShowSearchPopover as React.ComponentType<unknown>;
          const Zoom = s.Zoom as React.ComponentType<unknown>;
          const ZoomIn = s.ZoomIn as React.ComponentType<unknown>;
          const ZoomOut = s.ZoomOut as React.ComponentType<unknown>;
          return (
            <div
              style={{ display: "flex", alignItems: "center", width: "100%" }}
            >
              <div style={{ padding: "0 2px" }}>
                <ShowSearchPopover />
              </div>
              <div style={{ padding: "0 2px" }}>
                <ZoomOut />
              </div>
              <div style={{ padding: "0 2px" }}>
                <Zoom />
              </div>
              <div style={{ padding: "0 2px" }}>
                <ZoomIn />
              </div>
              <div style={{ padding: "0 2px", marginLeft: "auto" }}>
                <GoToPreviousPage />
              </div>
              <div
                style={{
                  padding: "0 2px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <CurrentPageInput />
              </div>
              <div style={{ padding: "0 2px" }}>
                <GoToNextPage />
              </div>
            </div>
          );
        }}
      </Toolbar>
    ),
  });

  if (!mounted || files.length === 0) {
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
        {workerUrl ? (
          <Worker workerUrl={workerUrl}>
            <div style={{ height: "100%", width: "100%", margin: "0 auto" }}>
              <Viewer
                fileUrl={buildFileUrl(activePdf.url)}
                plugins={[defaultLayoutPluginInstance]}
                theme={theme}
              />
            </div>
          </Worker>
        ) : (
          <div style={{ height: "100%", width: "100%", margin: "0 auto" }}>
            <Viewer
              fileUrl={buildFileUrl(activePdf.url)}
              plugins={[defaultLayoutPluginInstance]}
              theme={theme}
            />
          </div>
        )}
      </div>
    </div>
  );
}
