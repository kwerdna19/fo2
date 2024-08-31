"use client";
import type { Unit } from "@prisma/client";
import { cn } from "~/utils/styles";
import { UnitSprite } from "./UnitSprite";

export const getNumberDisplay = (
	count: number | string | [number, number],
	ops?: {
		fractionDigits?: number;
		notation?: "standard" | "compact";
	},
) => {
	if (typeof count === "string") {
		return count;
	}
	const formatter = Intl.NumberFormat("en-US", {
		notation: ops?.notation ?? "compact",
		maximumFractionDigits: ops?.fractionDigits ?? 1,
	});
	if (Array.isArray(count)) {
		return `${formatter.format(count[0])}-${formatter.format(count[1])}`;
	}
	return formatter.format(count);
};

export function PriceDisplay({
	count,
	className,
	size = "sm",
	unit = "COINS",
	...ops
}: {
	count: number | null | string | [number, number];
	className?: string;
	size?: "sm" | "xs";
	unit?: Unit;
	notation?: "standard" | "compact";
}) {
	if (count === null) {
		return null;
	}

	return (
		<div
			className={cn(
				className,
				"flex items-center",
				size === "xs" ? "gap-x-1.5" : "gap-x-2",
			)}
		>
			<UnitSprite type={unit} size={size} />
			{getNumberDisplay(count, ops)}
		</div>
	);
}
