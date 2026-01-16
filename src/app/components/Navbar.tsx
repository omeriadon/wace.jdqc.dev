"use client";

import styles from "./Navbar.module.css";
import Link from "next/link";
import { ProgressiveBlur } from "../../components/ProgressiveBlur";
import { usePdf } from "@/context/PdfContext";

const links = [
	{ title: "Textbooks", link: "/textbooks" }
];

export default function Navbar() {
	const { toggle, isOpen } = usePdf();

	return (
		<header className={styles.header}>
			<ProgressiveBlur
				className={styles.blur}
				blurIntensity={7.0}
				blurLayers={7}
			/>
			<nav className={styles.navbar}>
				<div className={styles.navbarContent}>
					<Link href="/" className={styles.logo}>
						WACE is Amazing
					</Link>

					<button
						onClick={toggle}
						className={styles.navItem}
						style={{
							position: "absolute",
							left: "50%",
							transform: "translateX(-50%)",
						}}
						data-text={isOpen ? "Close PDF Viewer" : "Open PDF Viewer"}
					>
						{isOpen ? "Close PDF Viewer" : "Open PDF Viewer"}
					</button>

					<ul className={styles.navItems}>
						{links.map((item) => (
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
				</div>
			</nav>
		</header>
	);
}
