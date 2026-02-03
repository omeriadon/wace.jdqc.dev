"use client";

import { useEffect, useState, ReactNode } from "react";

const HARDCODED_BOOKLIST_URL =
  "/cdn/" + encodeURIComponent("Perth Mod Booklist Year 11 2026.pdf");

interface WaceWindow extends Window {
  __wace_fetch_wrapped?: boolean;
  __wace_fetch_original?: typeof fetch;
}

export default function ClientWrapper({ children }: { children: ReactNode }) {
  const [isMobile, setIsMobile] = useState<boolean>(() =>
    typeof window !== "undefined" ? window.innerWidth <= 620 : false,
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 620);
    };

    window.addEventListener("resize", handleResize);

    try {
      if (typeof window !== "undefined") {
        const w = window as WaceWindow;

        if (!w.__wace_fetch_wrapped) {
          const originalFetch = window.fetch.bind(window);

          w.__wace_fetch_wrapped = true;
          w.__wace_fetch_original = originalFetch;

          window.fetch = async (
            input: RequestInfo | URL,
            init?: RequestInit,
          ): Promise<Response> => {
            const url =
              typeof input === "string"
                ? input
                : input instanceof Request
                  ? input.url
                  : input.toString();

            if (url === HARDCODED_BOOKLIST_URL) {
              return originalFetch(url);
            }

            try {
              if (input instanceof Request && init !== undefined) {
                return originalFetch(input, init);
              }

              return originalFetch(input);
            } catch (err) {
              console.error("fetch wrapper error", err);
              throw err;
            }
          };
        }
      }
    } catch (err) {
      console.warn("Failed to install fetch wrapper", err);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (isMobile) {
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
          textAlign: "center",
          padding: "2rem",
          fontSize: "1.2rem",
        }}
      >
        {"Use a desktop bro you aren't downloading textbooks on a phone."}
      </div>
    );
  }

  return <>{children}</>;
}
