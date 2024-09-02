"use client";

import { createColumnHelper } from "@tanstack/react-table";
import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { useQueryStates } from "nuqs";
import { TbCrown as Crown } from "react-icons/tb";
import SortButton from "~/components/SortButton";
import { useDataTableQueryParams } from "~/components/data-table/use-data-table-query";
import RangeField from "~/components/form/RangeField";
import { Form, SubmitButton, useZodForm } from "~/components/form/zod-form";
import { Button } from "~/components/ui/button";
import type { RouterOutputs } from "~/trpc/react";
import { LEVEL_CAP } from "~/utils/fo";
import { MobSprite } from "../../../components/MobSprite";
import { DataTable } from "../../../components/data-table/data-table";
import { mobSearchFilterSchema, mobSearchParamParser } from "../search-params";
import { DmgRange } from "./DmgRange";
import { DropGold } from "./DropGold";
import { DropsList } from "./DropsList";
import { MobHealth } from "./MobHealth";

type AllMobsResponse = RouterOutputs["mob"]["getAllPopulated"];
type Datum = AllMobsResponse["data"][number];

const columnHelper = createColumnHelper<Datum>();

// biome-ignore lint/suspicious/noExplicitAny: make TS happy
const columns: ColumnDef<Datum, any>[] = [
	columnHelper.display({
		id: "sprite",
		cell: ({ row }) => (
			<Link
				prefetch={false}
				href={`/mobs/${row.original.slug}`}
				className="flex justify-center items-center h-[64px] max-h-full overflow-hidden group-hover:overflow-visible"
			>
				<MobSprite
					url={row.original.spriteUrl}
					name={row.original.name}
					size="sm"
					className="-mt-[12px]"
				/>
			</Link>
		),
	}),
	columnHelper.accessor("name", {
		id: "name",
		enableHiding: false,
		cell: (info) => (
			<Link prefetch={false} href={`/mobs/${info.row.original.slug}`}>
				{info.getValue()}
			</Link>
		),
		header: SortButton,
		meta: {
			sortFieldReplacement: "slug",
		},
	}),
	columnHelper.accessor("level", {
		header: SortButton,
	}),
	columnHelper.accessor("boss", {
		header: SortButton,
		cell: ({ row }) =>
			row.original.boss ? <Crown className="h-5 w-5 text-yellow-600" /> : null,
	}),
	columnHelper.display({
		id: "gold",
		cell: ({ row }) => (
			<DropGold goldMin={row.original.goldMin} goldMax={row.original.goldMax} />
		),
		header: SortButton,
		meta: {
			sortTypes: [
				{ id: "goldMin", name: "Gold Min" },
				{ id: "goldMax", name: "Gold Max" },
			],
		},
	}),
	columnHelper.accessor("health", {
		cell: (info) => <MobHealth health={info.getValue()} />,
		header: SortButton,
	}),
	columnHelper.display({
		id: "loot",
		header: "Loot",
		cell: ({ row }) => (
			<DropsList
				infoInToolTip
				size="sm"
				drops={row.original.drops}
				className="flex-nowrap"
			/>
		),
	}),
	columnHelper.display({
		id: "faction",
		header: "Faction",
		cell: ({ row }) => <div>{row.original.faction?.name}</div>,
	}),
	columnHelper.display({
		id: "locations",
		header: "Locations",
		cell: ({ row }) => (
			<div>{row.original.locations.map((l) => l.area.name).join(", ")}</div>
		),
	}),
	columnHelper.display({
		id: "damage",
		cell: ({ row }) => (
			<DmgRange min={row.original.dmgMin} max={row.original.dmgMax} />
		),
		header: SortButton,
		meta: {
			sortTypes: [
				{ id: "dmgMin", name: "Dmg Min" },
				{ id: "dmgMax", name: "Dmg Max" },
			],
		},
	}),
	columnHelper.accessor("atkSpeed", {
		header: SortButton,
		meta: {
			heading: "Atk Speed",
		},
	}),
	columnHelper.accessor("numSpawns", {
		header: SortButton,
		meta: {
			heading: "# of Spawns",
		},
	}),
	columnHelper.accessor("spawnTimeSec", {
		header: SortButton,
		meta: {
			heading: "Spawn Time (s)",
		},
	}),
	columnHelper.accessor("artist", {
		header: SortButton,
	}),
	columnHelper.accessor("slug", {
		meta: {
			hidden: true,
		},
	}),
];

function MobSearchFilters() {
	const [filters, setFilters] = useQueryStates(mobSearchParamParser);
	const { resetPage } = useDataTableQueryParams();

	const form = useZodForm({
		schema: mobSearchFilterSchema,
		values: filters,
	});

	return (
		<Form
			handleSubmit={(f) => {
				resetPage();
				setFilters(f);
			}}
			persist
			form={form}
			className="flex-1 flex h-full flex-col gap-y-8"
		>
			<RangeField
				label="Level"
				control={form.control}
				nameMax="maxLevel"
				nameMin="minLevel"
				maxValue={LEVEL_CAP}
			/>

			<div className="p-3 border border-dashed">More filters to be added</div>

			<div className="pt-8 flex justify-end items-end gap-4 flex-1">
				<Button
					type="button"
					size="sm"
					variant="ghost"
					onClick={() =>
						setFilters((prev) =>
							Object.keys(prev).reduce(
								(acc, key) => {
									acc[key] = null;
									return acc;
								},
								{} as Record<string, unknown>,
							),
						)
					}
				>
					Clear
				</Button>
				<SubmitButton size="sm">Apply</SubmitButton>
			</div>
		</Form>
	);
}

export function MobTable({ data }: { data: AllMobsResponse }) {
	return (
		<DataTable
			title="Mobs"
			data={data}
			columns={columns}
			filtersComponent={<MobSearchFilters />}
			defaultColumnVisibility={{
				damage: false,
				atkSpeed: false,
				numSpawns: false,
				spawnTimeSec: false,
				artist: false,
				locations: false,
			}}
		/>
	);
}
