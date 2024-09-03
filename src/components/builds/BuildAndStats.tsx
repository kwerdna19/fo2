"use client";

import type { Item } from "@prisma/client";
import { useState } from "react";
import {
	type BasicStats,
	type Build,
	type PossibleBuild,
	STAT_POINTS_PER_LEVEL,
	Slot,
	getAllStats,
	getPossibleBuildFromItems,
	playerSlots,
} from "~/utils/fo-game";
import { cn } from "~/utils/styles";
import PossibleEquipmentBuild from "./PossibleEquipmentBuild";

export default function BuildAndStats({
	items,
	stat,
	opt,
	level,
}: { items: Item[]; stat?: BasicStats; opt: "max" | "min"; level: number }) {
	const [selectedIndices, setSelectedIndices] = useState<
		Record<keyof PossibleBuild, number>
	>({
		[Slot.HEAD]: 0,
		[Slot.FACE]: 0,
		[Slot.BACK]: 0,
		[Slot.SHOULDERS]: 0,
		[Slot.CHEST]: 0,
		[Slot.LEGS]: 0,
		[Slot.LEFT_RING]: 0,
		[Slot.RIGHT_RING]: 0,
		[Slot.MAIN_HAND]: 0,
		[Slot.LEFT_TRINKET]: 0,
		[Slot.RIGHT_TRINKET]: 0,
		[Slot.GUILD]: 0,
		[Slot.OFFHAND]: 0,
	});

	const possibleBuilds = getPossibleBuildFromItems(items);

	const build = playerSlots.reduce((acc, slot) => {
		if (slot === null) {
			return acc;
		}
		acc[slot] = possibleBuilds[slot]?.at(selectedIndices[slot]);
		return acc;
	}, {} as Build);

	const updateSlot = (slot: Slot, inc: 1 | -1) => {
		const possibleItems = possibleBuilds[slot];
		if (!possibleItems) {
			return;
		}
		if (inc === 1) {
			return setSelectedIndices((sel) => ({
				...sel,
				[slot]: sel[slot] + 1 >= possibleItems.length ? 0 : sel[slot] + 1,
			}));
		}
		return setSelectedIndices((sel) => ({
			...sel,
			[slot]: sel[slot] - 1 < 0 ? possibleItems.length - 1 : sel[slot] - 1,
		}));
	};

	const numSkillPoints = STAT_POINTS_PER_LEVEL * level;

	const allStats = getAllStats(
		build,
		level,
		stat && {
			[stat]: opt === "max" ? numSkillPoints : 0,
		},
	);

	return (
		<div>
			<PossibleEquipmentBuild
				possibleBuilds={possibleBuilds}
				selectedBuild={build}
				opt={opt}
				stat={stat}
				updateSlot={updateSlot}
				health={allStats.health}
				energy={allStats.energy}
			/>
			<div className="border mt-3 p-2 rounded-sm flex gap-8">
				<div className="space-y-1 flex-1">
					{(["sta", "str", "agi", "int", "armor"] as const).map((s) => {
						return (
							<div
								key={s}
								className={cn(
									"flex justify-between",
									s === stat && "font-bold",
								)}
							>
								<div>{s === "armor" ? "Armor" : s.toUpperCase()}</div>
								<div>{allStats[s]}</div>
							</div>
						);
					})}
				</div>

				<div className="space-y-1 flex-1">
					{(["atkPower", "crit", "dodge", "atkSpeed"] as const).map((s) => {
						return (
							<div key={s} className={cn("flex justify-between")}>
								<div>
									{s[0]?.toUpperCase()}
									{s.slice(1)}
								</div>
								<div>{Math.floor(allStats[s] * 100) / 100}</div>
							</div>
						);
					})}
					<div className={cn("flex justify-between")}>
						<div>Damage</div>
						<div>
							({allStats.dmgMin}-{allStats.dmgMax})
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
