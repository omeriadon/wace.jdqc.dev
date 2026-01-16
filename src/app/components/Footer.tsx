import styles from "./Footer.module.css";

export default function Footer() {
	return (
		<div className={styles.footer}>
			<div className={styles.footerContent}>
				<div className={styles.item}>Website hosted by Gilly.</div>
				<div className={styles.item}>Textbooks from many sources.</div>
				<div className={styles.item}>Website created by Gorilla.</div>
			</div>
		</div>
	);
}
