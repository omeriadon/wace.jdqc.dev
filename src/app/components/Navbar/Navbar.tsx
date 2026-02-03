"use client";

import { usePathname } from "next/navigation";
import styles from "./Navbar.module.css";
import Link from "next/link";
import { ProgressiveBlur } from "../../components/ProgressiveBlur";
import { usePdf } from "@/context/PdfContext";

const links = [{ title: "Textbooks", link: "/textbooks" }];

export default function Navbar() {
  const { toggle, isOpen } = usePdf();
  const pathname = usePathname();

  const pdfLabel = isOpen ? "Close PDF Viewer" : "Open PDF Viewer";

  return (
    <header className={styles.header}>
      <ProgressiveBlur
        className={styles.blur}
        blurIntensity={3}
        blurLayers={11}
      />

      <nav className={styles.navbar}>
        <div className={styles.navbarContent}>
          <Link href="/" className={styles.logo}>
            WACE is Amazing
          </Link>

          <ul className={styles.navItems}>
            {pathname !== "/textbooks" &&
              links.map((item) => (
                <Link
                  href={item.link}
                  key={item.link}
                  className={styles.navItem}
                  data-text={item.title}
                >
                  {item.title}
                </Link>
              ))}
          </ul>

          <button
            onClick={toggle}
            className={styles.navItem}
            data-text={pdfLabel}
          >
            {pdfLabel}
          </button>
        </div>
      </nav>
    </header>
  );
}
