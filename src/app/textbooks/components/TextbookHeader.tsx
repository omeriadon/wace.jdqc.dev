import Link from "next/link";
import path from "path";
import styles from "../Textbook.module.css";
import BlurText from "../../../components/BlurText.jsx";
import { formatName } from "@/lib/textbook-utils";

interface TextbookHeaderProps {
	currentPath: string;
	query: string;
}

export default function TextbookHeader({
	currentPath,
	query,
}: TextbookHeaderProps) {
	const safePath = currentPath.replace(/\.\./g, "");
	const parentPath = safePath ? path.dirname(safePath) : null;
	const isRoot = !safePath || safePath === ".";

	const pathSegments = safePath ? safePath.split("/") : [];
	const breadcrumbs = [
		"Textbooks",
		...pathSegments.map((segment) => formatName(segment)),
	];

	let cumulativeLength = 0;

	return (
		<div className={styles.header}>
			{!isRoot && !query && (
				<Link
					href={`/textbooks?path=${
						parentPath === "." || !parentPath
							? ""
							: encodeURIComponent(parentPath)
					}`}
					className={styles.backLink}
				>
					<span>←</span> Back
				</Link>
			)}

			{!query && (
				<div className={styles.breadcrumbs}>
					{breadcrumbs.map((crumb, index) => {
						const isLast = index === breadcrumbs.length - 1;
						const currentOffset = cumulativeLength;
						cumulativeLength += crumb.length;

						const separatorOffset = cumulativeLength;
						if (!isLast) cumulativeLength += 3;

						const breadcrumbHref =
							index === 0
								? "/textbooks"
								: `/textbooks?path=${encodeURIComponent(
										pathSegments.slice(0, index).join("/"),
									)}`;

						return (
							<a
								key={`${safePath}-${index}`}
								className={styles.breadcrumbItem}
								href={`${breadcrumbHref}`}
							>
								<BlurText
									text={crumb}
									delay={20}
									startOffset={currentOffset}
									animateBy="letters"
									direction="top"
									className={isLast ? styles.title : styles.titlePrevious}
									animationFrom={{ opacity: 0, translateY: 5 }}
									animationTo={{ opacity: isLast ? 1 : 0.5, translateY: 0 }}
								/>
								{!isLast && (
									<BlurText
										text=" / "
										delay={20}
										startOffset={separatorOffset}
										animateBy="letters"
										direction="top"
										className={styles.separator}
										animationFrom={{ opacity: 0, translateY: 5 }}
										animationTo={{ opacity: 0.5, translateY: 0 }}
									/>
								)}
							</a>
						);
					})}
				</div>
			)}
			{query && (
				<div className={styles.breadcrumbs}>
					<span className={styles.title}>Search results for "{query}"</span>
				</div>
			)}
		</div>
	);
}
