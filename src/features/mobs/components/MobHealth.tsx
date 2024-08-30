"use client";
import { HeartFilledIcon } from "@radix-ui/react-icons";
import { cn } from "~/utils/styles";

export function MobHealth({
	health,
	className,
	iconClassName,
}: {
	health: number | string | null;
	className?: string;
	iconClassName?: string;
}) {
	const getDisplay = () => {
		if (!health) {
			return "?";
		}

		if (typeof health === "string") {
			return health;
		}
		const formatter = Intl.NumberFormat("en-US", {
			notation: "compact",
			maximumFractionDigits: 1,
		});

		return formatter.format(health);
	};

	return (
		<div className={cn("flex items-center gap-x-1.5", className)}>
			<HeartFilledIcon className={cn("text-red-500 size-3", iconClassName)} />
			<div>{getDisplay()}</div>
		</div>
	);
}
