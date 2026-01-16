"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

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
  const [files, setFiles] = useState<PdfFile[]>([
    {
      name: "Booklist",
      url: "/Perth Mod Booklist Year 11 2026.pdf",
    },
  ]);
  const [activeFile, setActiveFile] = useState<string | null>(
    "/Perth Mod Booklist Year 11 2026.pdf"
  );
  const [isOpen, setIsOpen] = useState(false);

  // Load state from localStorage on mount
  useEffect(() => {
    const storedFiles = localStorage.getItem("pdf_files");
    const storedActive = localStorage.getItem("pdf_active");
    const storedIsOpen = localStorage.getItem("pdf_isOpen");

    if (storedFiles) {
      try {
        const parsedFiles = JSON.parse(storedFiles);
        // Ensure Booklist is always present
        const hasBooklist = parsedFiles.some(
          (f: PdfFile) => f.url === "/Perth Mod Booklist Year 11 2026.pdf"
        );
        if (!hasBooklist) {
          parsedFiles.unshift({
            name: "Booklist",
            url: "/Perth Mod Booklist Year 11 2026.pdf",
          });
        }
        setFiles(parsedFiles);
      } catch (e) {
        console.error("Failed to parse stored files", e);
      }
    }

    if (storedActive) {
      setActiveFile(storedActive);
    }

    if (storedIsOpen) {
      setIsOpen(storedIsOpen === "true");
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("pdf_files", JSON.stringify(files));
    if (activeFile) {
      localStorage.setItem("pdf_active", activeFile);
    }
    localStorage.setItem("pdf_isOpen", String(isOpen));
  }, [files, activeFile, isOpen]);

  const addFile = (file: PdfFile) => {
    setFiles((prev) => {
      if (prev.some((f) => f.url === file.url)) return prev;
      return [...prev, file];
    });
    setActiveFile(file.url);
    setIsOpen(true);
  };

  const removeFile = (url: string) => {
    // Prevent removing the booklist
    if (url === "/Perth Mod Booklist Year 11 2026.pdf") return;

    setFiles((prev) => {
      const newFiles = prev.filter((f) => f.url !== url);
      if (activeFile === url) {
        setActiveFile(
          newFiles.length > 0 ? newFiles[newFiles.length - 1].url : null
        );
      }
      return newFiles;
    });
  };

  const setActive = (url: string) => {
    setActiveFile(url);
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
