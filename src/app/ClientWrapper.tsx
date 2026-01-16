"use client";
import { useEffect, useState, ReactNode } from "react";

export default function ClientWrapper({ children }: { children: ReactNode }) {
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		setIsMobile(window.innerWidth <= 620);

		const handleResize = () => setIsMobile(window.innerWidth <= 620);
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	if (isMobile) {
		return (
			<div
				style={{
					position: "fixed",
					inset: 0,
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					zIndex: 9999,
					textAlign: "center",
					padding: "2rem",
					fontSize: "1.2rem",
				}}
			>
				Use a desktop bro you aren't downloading textbooks on a phone.
			</div>
		);
	}

	return <>{children}</>;
}
