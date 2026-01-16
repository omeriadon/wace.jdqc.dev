import Link from "next/link";
import styles from "./textbooks/Textbook.module.css";
import BlurText from "../components/BlurText.jsx";

export default function NotFound() {
	return (
		<div className={`${styles.container} text-3xl!`}>
			<div className={`${styles.header} gap-10`}>
				<Link href="/textbooks" className={styles.backLink}>
					<span>←</span> Home
				</Link>

				<BlurText
					text="404 - Not Found"
					delay={20}
					animateBy="letters"
					direction="top"
					className={`${styles.title} text-3xl!`}
					animationFrom={{ opacity: 0, translateY: 5 }}
					animationTo={{ opacity: 1, translateY: 0 }}
				/>
			</div>
		</div>
	);
}
