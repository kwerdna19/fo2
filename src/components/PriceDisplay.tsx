"use client";
import type { Unit } from "@prisma/client";
import { cn } from "~/utils/styles";
import { UnitSprite } from "./UnitSprite";

export function PriceDisplay({
	count,
	className,
	size = "sm",
	unit = "COINS",
	notation = "compact",
	maximumFractionDigits = 1,
}: {
	count: number | null | string;
	className?: string;
	size?: "sm" | "xs";
	unit?: Unit;
	notation?: "compact" | "standard";
	maximumFractionDigits?: number;
}) {
	if (count === null) {
		return null;
	}

	const getDisplay = () => {
		if (typeof count === "string") {
			return count;
		}
		const formatter = Intl.NumberFormat("en-US", {
			notation,
			maximumFractionDigits,
		});
		return formatter.format(count);
	};

	return (
		<div
			className={cn(
				className,
				"flex items-center",
				size === "xs" ? "gap-x-1" : "gap-x-2",
			)}
		>
			<UnitSprite type={unit} size={size} />
			{getDisplay()}
		</div>
	);
}
