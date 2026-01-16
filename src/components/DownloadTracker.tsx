"use client";

import { useEffect, useState } from "react";
import { ShimmeringText } from "./ShimmeringText";

export default function DownloadTracker({ className }: { className?: string }) {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchDownloads = async () => {
      try {
        console.log("DownloadTracker: fetching /api/downloads");
        const res = await fetch("/api/downloads");
        console.log("DownloadTracker: response", {
          ok: res.ok,
          status: res.status,
        });
        if (res.ok) {
          const data = await res.json();
          console.log("DownloadTracker: data", data);
          setCount(data.count);
        } else {
          console.warn("DownloadTracker: failed response", {
            status: res.status,
          });
        }
      } catch (err) {
        console.error("Failed to fetch downloads:", err);
      }
    };

    fetchDownloads();
  }, []);

  if (count === null) return null;

  const formattedMoney = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(count * 73.45);

  return (
    <>
      <ShimmeringText
        className={className}
        duration={2}
        text={`${count} files downloaded so far`}
        color="hsl(0, 0%, 50%)"
        shimmeringColor="hsl(210, 97%, 65%)"
      />
      <ShimmeringText
        className={className}
        duration={2}
        text={`${formattedMoney} saved so far`}
        color="hsl(0, 0%, 50%)"
        shimmeringColor="hsl(210, 97%, 65%)"
      />
    </>
  );
}
