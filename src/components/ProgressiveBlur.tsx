import { cn } from "@/lib/utils";

interface ProgressiveBlurProps {
	className?: string;
	direction?: "top" | "bottom" | "left" | "right";
	blurLayers?: number;
	blurIntensity?: number;
}

export function ProgressiveBlur({
	className,
	direction = "top",
	blurLayers = 8,
	blurIntensity = 0.25,
}: ProgressiveBlurProps) {
	const layers = Array.from({ length: blurLayers }, (_, i) => i);

	let gradientDirection = "to bottom";
	if (direction === "bottom") gradientDirection = "to top";
	if (direction === "left") gradientDirection = "to right";
	if (direction === "right") gradientDirection = "to left";

	return (
		<div
			className={cn(
				"absolute inset-0 pointer-events-none select-none",
				className,
			)}
		>
			{layers.map((i) => (
				<div
					key={i}
					className="absolute inset-0"
					style={{
						zIndex: i,
						backdropFilter: `blur(${blurIntensity}px)`,
						WebkitBackdropFilter: `blur(${blurIntensity}px)`,
						maskImage: `linear-gradient(${gradientDirection}, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) ${
							(i + 1) * (100 / blurLayers)
						}%)`,
						WebkitMaskImage: `linear-gradient(${gradientDirection}, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) ${
							(i + 1) * (100 / blurLayers)
						}%)`,
					}}
				/>
			))}
		</div>
	);
}
