import styles from "./Home.module.css";
import Link from "next/link";
import BlurText from "@/components/BlurText";
import VisitorTracker from "@/components/VisitorTracker";
import DownloadTracker from "@/components/DownloadTracker";

export default function Home() {
	return (
		<div className={styles.container}>
			<BlurText
				text="WACE is amazing!"
				delay={70}
				startOffset={0}
				animateBy="letters"
				direction="top"
				className={`${styles.title} centered-container`}
				animationFrom={{ opacity: 0, translateY: 15 }}
				animationTo={{ opacity: 1, translateY: 0 }}
			/>

			<h2 className={`${styles.subtitle} ${styles.container}`}>
				<div>No it's not.</div>
				<br />

				<div>
					So we "borrowed" all (most) of the textbooks you need for next year.
				</div>
				<br />
				<div>Yes, it's just the pdfs, you don't need the paper version.</div>
			</h2>

			<VisitorTracker className={styles.visitorCount} />
			<DownloadTracker className={styles.visitorCount} />

			<Link href="/textbooks" className={styles.button}>
				Textbooks →
			</Link>

			<a
				href="/Perth Mod Booklist Year 11 2026.pdf"
				download
				className={`${styles.button} flex flex-col items-center text-center gap-4`}
			>
				<div>Download Booklist ↓</div>
				<div className="font-new-york text-sm">
					<span className="bg-yellow-500 py-0.5 px-1 rounded-lg">Yellow</span>
					<span> highlights are available resources, </span>
					<span className="bg-red-500 py-0.5 px-1 rounded-lg">red</span>
					<span className=""> are unavailable.</span>
				</div>
			</a>
		</div>
	);
}
