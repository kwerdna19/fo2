"use client";

import { createColumnHelper } from "@tanstack/react-table";
import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { useQueryStates } from "nuqs";
import { TbCrown as Crown } from "react-icons/tb";
import { MobSprite } from "~/components/MobSprite";
import SortButton from "~/components/SortButton";
import { DataTable } from "~/components/data-table/data-table";
import {
	useDataTableQueryOptions,
	useDataTableQueryParams,
} from "~/components/data-table/use-data-table-query";
import RangeField from "~/components/form/RangeField";
import { Form, SubmitButton, useZodForm } from "~/components/form/zod-form";
import { Button } from "~/components/ui/button";
import { ItemList } from "~/features/items/components/ItemList";
import { type RouterOutputs, api } from "~/trpc/react";
import type { TableProps } from "~/types/table";
import { LEVEL_CAP } from "~/utils/fo-game";
import { mobSearchFilterSchema, mobSearchParamParser } from "../search-params";
import { DmgRange } from "./DmgRange";
import { DropGold } from "./DropGold";
import FactionDisplay from "./FactionDisplay";
import { MobHealth } from "./MobHealth";

export type MobDatum = RouterOutputs["mob"]["getAllPopulated"]["data"][number];

const columnHelper = createColumnHelper<MobDatum>();

// biome-ignore lint/suspicious/noExplicitAny: make TS happy
export const mobTableColumns: ColumnDef<MobDatum, any>[] = [
	columnHelper.accessor("spriteName", {
		header: "Sprite",
		cell: ({ row }) => (
			<Link
				prefetch={false}
				href={`/mobs/${row.original.slug}`}
				className="flex justify-center items-center h-[64px] max-h-full overflow-hidden group-hover:overflow-visible"
			>
				<MobSprite
					url={row.original.spriteName}
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
	columnHelper.accessor("desc", {}),
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
	columnHelper.accessor("drops", {
		header: "Drops",
		cell: ({ row }) => (
			<ItemList
				size="sm"
				data={row.original.drops}
				getAttributes={(d) => ({
					"Drop Rate": `${d.dropRate}%`,
					"Sell Price": {
						unit: d.item.sellPriceUnit,
						value: d.item.sellPrice,
					},
				})}
				className="flex-nowrap"
			/>
		),
	}),
	columnHelper.accessor("faction", {
		header: "Faction",
		cell: ({ row }) => <FactionDisplay data={row.original} />,
	}),
	columnHelper.accessor((m) => (m.factionXp > 0 ? m.factionXp : null), {
		id: "factionXp",
		header: "Faction XP",
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
	columnHelper.accessor("moveSpeed", {
		header: SortButton,
		meta: {
			heading: "Move Speed",
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

export function MobTable(props: TableProps<"mob", "getAllPopulated">) {
	const { params, options } = useDataTableQueryOptions(
		mobSearchParamParser,
		props,
	);
	const { data } = api.mob.getAllPopulated.useQuery(params, options);

	return (
		<DataTable
			title="Mobs"
			data={data ?? { data: [], totalCount: 0 }}
			columns={mobTableColumns}
			filtersComponent={<MobSearchFilters />}
			defaultColumnVisibility={{
				damage: false,
				atkSpeed: false,
				numSpawns: false,
				spawnTimeSec: false,
				artist: false,
				locations: false,
				desc: false,
				moveSpeed: false,
			}}
		/>
	);
}
