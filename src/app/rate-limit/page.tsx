import Link from "next/link";
import styles from "./RateLimit.module.css";
import { AlertCircle } from "lucide-react";

export default function RateLimitPage() {
  return (
    <div className={styles.container}>
      <AlertCircle className={styles.icon} size={64} />
      <h1 className={styles.title}>Too many textbooks?</h1>
      <p className={styles.message}>
        You&apos;ve downloaded a lot of textbooks recently. To ensure fair usage
        for everyone, we&apos;ve temporarily paused your downloads. Please try
        again in an hour.
      </p>
      <Link href="/textbooks" className={styles.button}>
        Return to Textbooks
      </Link>
    </div>
  );
}
