"use client";

import { motion } from "motion/react";
import FileRow from "./FileRow";
import styles from "../textbooks/Textbook.module.css";

interface FileItem {
  name: string;
  isDirectory: boolean;
  path: string;
  displayName: string;
  size: string;
}

export default function FileList({
  items,
  showPath = false,
}: {
  items: FileItem[];
  showPath?: boolean;
}) {
  console.log("FileList render", { count: items.length, items });
  return (
    <div className={styles.grid}>
      {items.map((item, index) => (
        <motion.div
          key={item.path}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.2,
            delay: Math.min(index * 0.03, 0.3),
            ease: "easeOut",
          }}
          layout="position"
        >
          <FileRow item={item} showPath={showPath} />
        </motion.div>
      ))}
    </div>
  );
}
