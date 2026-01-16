import styles from "../Textbook.module.css";
import { InfoIcon } from "@/components/Icons";

interface TextbookNotesProps {
	noteContents: string[];
}

export default function TextbookNotes({ noteContents }: TextbookNotesProps) {
	if (noteContents.length === 0) return null;

	return (
		<>
			{noteContents.map((content, index) => (
				<div key={index} className={styles.noteWrapper}>
					<div className={styles.noteIndicator} />
					<div className={styles.noteInner}>
						<div className={styles.noteIcon}>
							<InfoIcon width={40} height={40} />
						</div>
						<div className={styles.noteTextContainer}>
							<p className={styles.noteText}>{content}</p>
						</div>
					</div>
				</div>
			))}
		</>
	);
}
