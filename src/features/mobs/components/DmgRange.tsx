"use client";
import { getNumberDisplay } from "~/components/PriceDisplay";

export function DmgRange({
	min,
	max,
	className,
}: { min: number | null; max: number | null; className?: string }) {
	if (min !== null && max !== null) {
		return (
			<div className={className}>
				{getNumberDisplay(min === max ? min : [min, max])}
			</div>
		);
	}

	if (min === null && max !== null) {
		return <div className={className}>{getNumberDisplay(max)}</div>;
	}

	if (min !== null && max === null) {
		return <div className={className}>{getNumberDisplay(min)}</div>;
	}

	return null;
}
