"use client";
import { useEffect, useState, ReactNode } from "react";

export default function ClientWrapper({ children }: { children: ReactNode }) {
const [isMobile, setIsMobile] = useState<boolean>(() =>
		typeof window !== "undefined" ? window.innerWidth <= 620 : false,
	);

	useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 620);
    window.addEventListener("resize", handleResize);

    // Wrap window.fetch to log requests related to textbooks, pdfs, and api/download
    try {
      if (typeof window !== "undefined" && !(window as any).__wace_fetch_wrapped) {
        const originalFetch = window.fetch.bind(window);
        (window as any).__wace_fetch_wrapped = true;
        (window as any).__wace_fetch_original = originalFetch;
        window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
          try {
            const url = typeof input === "string" ? input : input instanceof Request ? input.url : String(input);
            const method = (init && init.method) || (input instanceof Request && input.method) || "GET";
            const isFileFetch = /textbooks|\.pdf|pdf\.worker|\/fonts\/|\.js$|\/api\/download|\/cdn\/|cdn\.jdqc|wace\.jdqc|cdn\./i.test(url);
            if (isFileFetch) {
              console.log("fetch intercepted", { url, method, init });
            }
            const res = await originalFetch(input, init);
            if (isFileFetch) {
              console.log("fetch response", { url, status: res.status, ok: res.ok, headers: { 'content-type': res.headers.get('content-type'), 'content-length': res.headers.get('content-length') } });
            }
            return res;
          } catch (err) {
            console.error("fetch wrapper error", err);
            throw err;
          }
        };
      }
    } catch (err) {
      console.warn("Failed to install fetch wrapper", err);
    }

    return () => window.removeEventListener("resize", handleResize);
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
