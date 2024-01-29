"use client";
import { PriceDisplay } from "~/components/PriceDisplay";

export function DropGold({
	goldMin,
	goldMax,
	className,
}: { goldMin: number; goldMax: number; className?: string }) {
	return (
		<PriceDisplay
			count={goldMax === goldMin ? goldMin : `${goldMin}-${goldMax}`}
			className={className}
		/>
	);
}
