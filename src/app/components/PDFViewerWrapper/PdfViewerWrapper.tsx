"use client";

import React, { useState, useEffect, useRef } from "react";
import styles from "./PdfViewerWrapper.module.css";
import { usePdf } from "@/context/PdfContext";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "motion/react";

const PdfViewer = dynamic(() => import("../PDFViewer/PdfViewer"), {
  ssr: false,
});

export default function PdfViewerWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isOpen } = usePdf();
  const [mounted, setMounted] = useState(false);
  const [width, setWidth] = useState(600);
  const [height, setHeight] = useState(400);
  const [isResizing, setIsResizing] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1000);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const startResizing = React.useCallback(() => setIsResizing(true), []);
  const stopResizing = React.useCallback(() => setIsResizing(false), []);

  const resize = React.useCallback(
    (e: MouseEvent) => {
      if (!isResizing) return;

      if (isMobile) {
        const newHeight = window.innerHeight - e.clientY;
        if (newHeight > 100 && newHeight < window.innerHeight - 100)
          setHeight(newHeight);
      } else {
        const newWidth = window.innerWidth - e.clientX;
        const maxWidth = window.innerWidth * 0.6;
        const minWidth = window.innerWidth * 0.3;
        if (newWidth > minWidth && newWidth < maxWidth) setWidth(newWidth);
      }
    },
    [isResizing, isMobile],
  );

  useEffect(() => {
    window.addEventListener("mousemove", resize);
    window.addEventListener("mouseup", stopResizing);
    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [resize, stopResizing]);

  if (!mounted) return <div className={styles.wrapper}>{children}</div>;

  return (
    <div className={styles.wrapper}>
      <motion.div
        className={styles.mainContent}
        animate={{
          marginRight: !isMobile && isOpen ? width : 0,
          marginBottom: isMobile && isOpen ? height : 0,
        }}
        transition={{
          type: "tween",
          ease: "easeInOut",
          duration: isResizing ? 0 : 0.3,
        }}
      >
        {children}
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="pdf-viewer"
            ref={sidebarRef}
            className={styles.viewerContainer}
            initial={isMobile ? { y: "100%" } : { x: "100%" }}
            animate={{ x: 0, y: 0 }}
            exit={isMobile ? { y: "100%" } : { x: "100%" }}
            transition={{
              type: "tween",
              ease: "easeInOut",
              duration: isResizing ? 0 : 0.3,
            }}
            style={{
              width: isMobile ? "100%" : width,
              height: isMobile ? height : "100%",
            }}
          >
            <div className={styles.resizer} onMouseDown={startResizing} />
            <PdfViewer />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
