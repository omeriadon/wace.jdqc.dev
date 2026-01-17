"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

import {
  toRelativePath,
  BOOKLIST_PATH,
  isBooklistPath,
} from "../lib/cdn-utils";

export interface PdfFile {
  name: string;
  url: string;
}

interface PdfContextType {
  files: PdfFile[];
  activeFile: string | null;
  isOpen: boolean;
  addFile: (file: PdfFile) => void;
  removeFile: (url: string) => void;
  setActive: (url: string) => void;
  toggle: () => void;
  setIsOpen: (isOpen: boolean) => void;
}

const PdfContext = createContext<PdfContextType | undefined>(undefined);

export function PdfProvider({ children }: { children: ReactNode }) {
  const [files, setFiles] = useState<PdfFile[]>(() => {
    try {
      const stored = localStorage.getItem("pdf_files");
      if (stored) {
        const parsed = JSON.parse(stored).map((f: PdfFile) => ({
          name: f.name,
          url: toRelativePath(f.url),
        }));
        const hasBooklist = parsed.some(
          (f: PdfFile) => toRelativePath(f.url) === BOOKLIST_PATH,
        );
        if (!hasBooklist)
          parsed.unshift({ name: "Booklist", url: BOOKLIST_PATH });
        return parsed;
      }
    } catch {}
    return [{ name: "Booklist", url: BOOKLIST_PATH }];
  });

  const [activeFile, setActiveFile] = useState<string | null>(() => {
    try {
      const storedActive = localStorage.getItem("pdf_active");
      return storedActive ? toRelativePath(storedActive) : BOOKLIST_PATH;
    } catch {
      return BOOKLIST_PATH;
    }
  });

  const [isOpen, setIsOpen] = useState<boolean>(() => {
    try {
      const storedIsOpen = localStorage.getItem("pdf_isOpen");
      return storedIsOpen ? storedIsOpen === "true" : false;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    localStorage.setItem("pdf_files", JSON.stringify(files));
    if (activeFile) {
      localStorage.setItem("pdf_active", activeFile);
    }
    localStorage.setItem("pdf_isOpen", String(isOpen));
  }, [files, activeFile, isOpen]);

  const addFile = (file: PdfFile) => {
    const normalizedUrl = toRelativePath(file.url);
    console.log("PdfContext.addFile", {
      original: file.url,
      normalized: normalizedUrl,
    });
    setFiles((prev) => {
      if (prev.some((f) => toRelativePath(f.url) === normalizedUrl))
        return prev;
      return [...prev, { ...file, url: normalizedUrl }];
    });
    setActiveFile(normalizedUrl);
    setIsOpen(true);
  };

  const removeFile = (url: string) => {
    if (isBooklistPath(url)) return;

    const normalizedUrl = toRelativePath(url);

    setFiles((prev) => {
      const newFiles = prev.filter(
        (f) => toRelativePath(f.url) !== normalizedUrl,
      );
      if (toRelativePath(activeFile || "") === normalizedUrl) {
        setActiveFile(
          newFiles.length > 0 ? newFiles[newFiles.length - 1].url : null,
        );
      }
      return newFiles;
    });
  };

  const setActive = (url: string) => {
    const normalized = toRelativePath(url);
    console.log("PdfContext.setActive", { url, normalized });
    setActiveFile(normalized);
  };

  const toggle = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <PdfContext.Provider
      value={{
        files,
        activeFile,
        isOpen,
        addFile,
        removeFile,
        setActive,
        toggle,
        setIsOpen,
      }}
    >
      {children}
    </PdfContext.Provider>
  );
}

export function usePdf() {
  const context = useContext(PdfContext);
  if (context === undefined) {
    throw new Error("usePdf must be used within a PdfProvider");
  }
  return context;
}
