"use client";

import { useEffect, useState } from "react";
import { ShimmeringText } from "./ShimmeringText";

export default function VisitorTracker({ className }: { className?: string }) {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const checkAndIncrement = async () => {
      try {
        const hasVisited = document.cookie
          .split("; ")
          .find((row) => row.startsWith("wace_visited="));

        let res;
        if (!hasVisited) {
          console.log("VisitorTracker: POST /api/visit (increment)");
          res = await fetch("/api/visit", { method: "POST" });
          document.cookie = "wace_visited=true; path=/; max-age=31536000";
          console.log("increment");
        } else {
          console.log("VisitorTracker: GET /api/visit (fetch)");
          res = await fetch("/api/visit");
          console.log("visit");
        }

        console.log("VisitorTracker: response", {
          ok: res.ok,
          status: res.status,
        });
        if (res.ok) {
          const data = await res.json();
          console.log("VisitorTracker: data", data);
          setCount(data.count);
        }
      } catch (err) {
        console.error("Failed to track visit:", err);
      }
    };

    checkAndIncrement();
  }, []);

  if (count === null) return null;

  return count !== null ? (
    <ShimmeringText
      className={className}
      duration={2}
      text={`${count} different people have visited so far`}
      color="hsl(0, 0%, 50%)"
      shimmeringColor="hsl(210, 97%, 65%)"
    />
  ) : null;
}
