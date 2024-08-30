"use client";
import type { Item, Skill } from "@prisma/client";
import type { ReactNode } from "react";
import type { BasicStats, DerivedStats } from "~/utils/fo";
import { cn } from "~/utils/styles";

type Stats = Partial<Pick<Skill, BasicStats | DerivedStats>>;

export function ItemStats(props: {
	stats: Stats;
	className?: string;
	fallback?: ReactNode;
}) {
	const { className, stats: inputItem, fallback } = props;

	const armor = inputItem.armor;

	const stats = (
		[
			"str",
			"agi",
			"int",
			"sta",
			"crit",
			"dodge",
			"atkPower",
			// "health",
			// "energy",
		] as const
	)
		.filter((s) => inputItem[s] !== null && typeof inputItem[s] !== "undefined")
		.map((s) => {
			return {
				stat: s.toUpperCase().replace("ATKPOWER", "ATK"),
				value: inputItem[s] as number,
			};
		});
	//.sort((a, b) => b.value - a.value)
	if (stats.length === 0) {
		return fallback;
	}

	return (
		<div className={cn("text-sm flex justify-start", className)}>
			{stats.length > 0 ? (
				<div
					className={cn(
						"bg-slate-200 dark:bg-slate-600 gap-y-1 gap-x-4 rounded-md p-1 px-2 grid",
						stats.length > 1 ? "grid-cols-2" : "grid-cols-1",
					)}
				>
					{stats.map(({ stat, value }) => {
						return (
							<div key={stat} className="flex gap-x-1.5">
								<div className="bg-slate-300 dark:bg-slate-700 text-center rounded-sm px-0.5 flex items-center">
									{value > 0 ? `+${value}` : value}
									{stat === "CRIT" ? (
										<span className="text-xs ml-0.5">%</span>
									) : null}
								</div>
								<div className="flex-1">{stat}</div>
							</div>
						);
					})}
				</div>
			) : null}
		</div>
	);
}
