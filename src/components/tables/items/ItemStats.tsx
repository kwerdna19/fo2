"use client";
import { Skill, type Item } from "@prisma/client";
import { DerivedStats, type BasicStats } from "~/utils/fo";
import { cn } from "~/utils/styles";

type Stats = Pick<Skill, BasicStats | DerivedStats>;

export function ItemStats(props: {
	stats: Stats;
	className?: string;
}) {
	const { className, stats: inputItem } = props;

	const armor = inputItem.armor;

	const stats = (["str", "agi", "int", "sta", "crit", "dodge"
,"atkPower"
,"armor"
,"health"
,"energy"] as const)
		.filter((s) => inputItem[s] !== null)
		.map((s) => {
			return {
				stat: s.toUpperCase().replace('ATKPOWER', 'ATK'),
				value: inputItem[s] as number,
			};
		});
	//.sort((a, b) => b.value - a.value)
	if (stats.length === 0 && !armor) {
		return null;
	}

	return (
		<div className={cn(className, "flex text-sm")}>
			{stats.length > 0 ? (
				<div className="bg-slate-200 dark:bg-slate-600 space-y-1.5 rounded-md p-1 mb-1">
					{stats.map(({ stat, value }) => {
						return (
							<div key={stat} className="flex justify-between gap-x-0.5">
								<div className="bg-slate-300 dark:bg-slate-700 text-center rounded-sm px-0.5">
									{value > 0 ? `+${value}` : value}
								</div>
								<div className="flex-1 text-center pl-1">{stat}</div>
							</div>
						);
					})}
				</div>
			) : null}
			{armor ? (
				<div className="p-1">
					<span>{armor > 0 ? `+${armor}` : armor}</span> <span>Armor</span>
				</div>
			) : null}
		</div>
	);
}
