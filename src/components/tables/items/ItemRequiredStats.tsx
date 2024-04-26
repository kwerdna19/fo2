"use client";
import type { Item } from "@prisma/client";
import type { ReactNode } from "react";
import type { RequiredStats } from "~/utils/fo";
import { cn } from "~/utils/styles";

export function ItemRequiredStats(props: {
	stats: Pick<Item, RequiredStats>;
	className?: string;
	fallback?: ReactNode;
}) {
	const { className, stats: inputItem, fallback } = props;

	const stats = (["reqStr", "reqAgi", "reqInt", "reqSta"] as const)
		.filter((s) => inputItem[s] !== null)
		.map((s) => {
			return {
				stat: s.replace("req", "").toUpperCase(),
				value: inputItem[s] as number,
			};
		});
	//.sort((a, b) => b.value - a.value)
	if (stats.length === 0) {
		return fallback;
	}

	return (
		<div
			className={cn(
				"text-sm bg-amber-200 dark:bg-amber-700 w-16 space-y-1.5 rounded-md p-1 mb-1",
				className,
			)}
		>
			{stats.map(({ stat, value }) => {
				return (
					<div key={stat} className="flex justify-between">
						<div className="bg-amber-300 dark:bg-amber-800 w-6 text-center rounded-sm">
							{value}
						</div>
						<div className="flex-1 text-center pl-1">{stat}</div>
					</div>
				);
			})}
		</div>
	);
}
