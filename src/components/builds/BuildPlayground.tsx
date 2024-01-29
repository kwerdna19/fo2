"use client";

import { type Item } from "@prisma/client";
import { ChevronsDown, ChevronsUp, Minus, Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
	BASE_BASIC_STAT,
	BASE_STATS,
	type Build,
	LEVEL_CAP,
	STAT_POINTS_PER_LEVEL,
	Slot,
	type Stat,
	getAllStats,
	playerSlots,
	stats,
} from "~/utils/fo";
import { cn } from "~/utils/styles";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import EquipmentBuild from "./EquipmentBuild";

type Config = {
	level: number;
	statPoints: Record<Stat, number>;
};

export default function BuildPlayground({ items }: { items: Item[] }) {
	const { register, watch, setValue } = useForm<Config>({
		defaultValues: {
			level: LEVEL_CAP,
			statPoints: BASE_STATS,
		},
	});

	const level = watch("level");

	const totalStatPoints = STAT_POINTS_PER_LEVEL * level;

	const maxStat = BASE_BASIC_STAT + totalStatPoints;

	const agi = watch("statPoints.agi");
	const sta = watch("statPoints.sta");
	const str = watch("statPoints.str");
	const int = watch("statPoints.int");

	const statAssignments = { agi, sta, str, int };

	// const statPoints = watch('statPoints')

	const totalStats = (agi || 0) + (str || 0) + (sta || 0) + (int || 0);
	const totalBasicStats = stats.length * BASE_BASIC_STAT;
	const totalAssigned = totalStats - totalBasicStats;
	const statPointsRemaining = totalStatPoints - totalAssigned;

	const [selectedItemIndices, setSelectedItemIndices] = useState<
		Record<Slot, number | null>
	>({
		[Slot.HEAD]: null,
		[Slot.FACE]: null,
		[Slot.BACK]: null,
		[Slot.SHOULDERS]: null,
		[Slot.CHEST]: null,
		[Slot.LEGS]: null,
		[Slot.LEFT_RING]: null,
		[Slot.RIGHT_RING]: null,
		[Slot.MAIN_HAND]: null,
		[Slot.LEFT_TRINKET]: null,
		[Slot.RIGHT_TRINKET]: null,
		[Slot.GUILD]: null,
		[Slot.OFFHAND]: null,
	});

	const build = playerSlots.reduce((acc, slot) => {
		if (slot === null) {
			return acc;
		}
		const index = selectedItemIndices[slot];
		const item = index !== null ? items[index] : null;
		if (item) {
			acc[slot] = item;
		}
		return acc;
	}, {} as Build);

	const updateSlot = (slot: Slot, newItemId: string | null | undefined) => {
		const index = newItemId
			? items.findIndex((item) => newItemId === item.id)
			: null;

		setSelectedItemIndices((sel) => ({
			...sel,
			[slot]: index === -1 ? null : index,
		}));
	};

	const allStats = getAllStats(build, level, { str, agi, sta, int });

	const renderStatPointField = (stat: Stat) => {
		return (
			<div className="flex items-center gap-x-4">
				<div className="text-md flex-1 px-1 font-bold uppercase">{stat}</div>
				<Input
					{...register(`statPoints.${stat}`, {
						min: BASE_BASIC_STAT,
						max: maxStat,
						required: true,
						valueAsNumber: true,
					})}
					type="number"
					className="min-w-[72px]"
				/>
				<Button
					size="icon"
					className="flex-shrink-0"
					onClick={() => {
						setValue(`statPoints.${stat}`, BASE_BASIC_STAT);
					}}
				>
					<ChevronsDown className="h-5 w-5" />
				</Button>
				<div className="flex flex-shrink-0 gap-x-2">
					<Button
						size="icon"
						onClick={() =>
							setValue(`statPoints.${stat}`, statAssignments[stat] - 1)
						}
					>
						<Minus className="h-5 w-5" />
					</Button>
					<Button
						size="icon"
						onClick={() =>
							setValue(`statPoints.${stat}`, statAssignments[stat] + 1)
						}
					>
						<Plus className="h-5 w-5" />
					</Button>
				</div>
				<Button
					size="icon"
					className="flex-shrink-0"
					onClick={() => {
						setValue(`statPoints.${stat}`, maxStat);
					}}
				>
					<ChevronsUp className="h-5 w-5" />
				</Button>
			</div>
		);
	};

	return (
		<div className="w-full flex flex-col-reverse lg:flex-row gap-6 lg:gap-3">
			<Card className="flex-1">
				<div className="space-y-4">
					<div className="p-3 space-y-1">
						<Label>Level</Label>
						<Input
							{...register("level", {
								// min: 1,
								// max: LEVEL_CAP,
								required: true,
								valueAsNumber: true,
							})}
							type="number"
						/>
					</div>
					<fieldset className="p-3 space-y-1">
						<Label className="mb-3">Stat Points</Label>
						<div className="space-y-4">
							{renderStatPointField("agi")}
							{renderStatPointField("str")}
							{renderStatPointField("sta")}
							{renderStatPointField("int")}
							<div>
								Remaining:{" "}
								<span className={cn(statPointsRemaining < 0 && "text-red-500")}>
									{statPointsRemaining}
								</span>
							</div>
						</div>
					</fieldset>
				</div>
			</Card>
			<div className="col-span-3">
				<EquipmentBuild
					build={build}
					updateSlot={updateSlot}
					health={allStats.health}
					energy={allStats.energy}
					items={items}
				/>
				<Card className="mt-3 p-2 flex gap-8">
					<div className="space-y-1 flex-1">
						{(["sta", "str", "agi", "int", "armor"] as const).map((s) => {
							return (
								<div
									key={s}
									className={cn(
										"flex justify-between",
										s === "armor" ? "capitalize" : "uppercase",
									)}
								>
									<div>{s}</div>
									<div>{allStats[s]}</div>
								</div>
							);
						})}
					</div>
					<div className="space-y-1 flex-1">
						{(["atkPower", "crit", "dodge", "atkSpeed"] as const).map((s) => {
							return (
								<div key={s} className="flex justify-between capitalize">
									<div>{s}</div>
									<div>
										{Math.round(allStats[s] * 100) / 100}
										{["crit", "dodge"].includes(s) ? " %" : ""}
									</div>
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
				</Card>
			</div>
			<div className="flex-1"></div>
		</div>
	);
}
