"use client";

import { createColumnHelper } from "@tanstack/react-table";
import Link from "next/link";
import { useQueryStates } from "nuqs";
import { ItemSprite } from "~/components/ItemSprite";
import { PriceDisplay } from "~/components/PriceDisplay";
import SortButton from "~/components/SortButton";

import { EquippableType } from "@prisma/client";
import { keepPreviousData } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { CommandList } from "cmdk";
import { Check } from "lucide-react";
import { Controller } from "react-hook-form";
import { DataTable } from "~/components/data-table/data-table";
import { dataTableSearchParams } from "~/components/data-table/data-table-utils";
import { useDataTableQueryParams } from "~/components/data-table/use-data-table-query";
import RangeField from "~/components/form/RangeField";
import { Form, SubmitButton, useZodForm } from "~/components/form/zod-form";
import { Button } from "~/components/ui/button";
import { Command, CommandItem } from "~/components/ui/command";
import { Label } from "~/components/ui/label";
import { ScrollArea } from "~/components/ui/scroll-area";
import { DmgRange } from "~/features/mobs/components/DmgRange";
import { type RouterInputs, type RouterOutputs, api } from "~/trpc/react";
import { LEVEL_CAP } from "~/utils/fo-game";
import { shallowCompare } from "~/utils/misc";
import { cn } from "~/utils/styles";
import {
	itemSearchFilterSchema,
	itemSearchParamParser,
} from "../search-params";
import { CraftedByList } from "./CraftedByList";
import { DroppedByList } from "./DroppedByList";
import { ItemStats } from "./ItemStats";
import { SoldByList } from "./SoldByList";

type AllItemsResponse = RouterOutputs["item"]["getAllPopulated"];
type AllItemsInput = RouterInputs["item"]["getAllPopulated"];

export type Datum = AllItemsResponse["data"][number];
const columnHelper = createColumnHelper<Datum>();

const getNameFromEquip = (equip: EquippableType) => {
	return equip
		.replace(/_/g, " ")
		.replace("COSMETIC", "OUTFIT")
		.toLocaleLowerCase();
};

const equipTypeOptions = Object.values(EquippableType).map((type) => ({
	value: type,
	name: getNameFromEquip(type),
}));

export const columns = [
	columnHelper.display({
		id: "sprite",
		header: () => null,
		cell: ({ row }) => (
			<Link
				className="flex justify-center items-center h-[64px]"
				prefetch={false}
				href={`/items/${row.original.slug}`}
			>
				<ItemSprite
					url={row.original.spriteUrl}
					name={row.original.name}
					size="sm"
					bg
				/>
			</Link>
		),
	}),
	columnHelper.accessor("name", {
		cell: (info) => (
			<Link prefetch={false} href={`/items/${info.row.original.slug}`}>
				{info.getValue()}
			</Link>
		),
		header: SortButton,
		meta: {
			sortFieldReplacement: "slug",
		},
	}),
	columnHelper.accessor("desc", {
		header: "Desc",
	}),
	columnHelper.accessor("slug", {
		header: SortButton,
		meta: {
			hidden: true,
		},
	}),
	columnHelper.accessor("equip", {
		header: SortButton,
		meta: {
			heading: "Equip Type",
		},
		cell: (info) => {
			const equip = info.getValue();

			if (!equip) {
				return null;
			}

			return <div className="capitalize">{getNameFromEquip(equip)}</div>;
		},
	}),
	columnHelper.accessor("levelReq", {
		header: SortButton,
		meta: {
			heading: "Level",
		},
	}),
	columnHelper.accessor("sta", {
		header: SortButton,
		meta: {
			heading: "STA",
		},
	}),
	columnHelper.accessor("str", {
		header: SortButton,
		meta: {
			heading: "STR",
		},
	}),
	columnHelper.accessor("int", {
		header: SortButton,
		meta: {
			heading: "INT",
		},
	}),
	columnHelper.accessor("agi", {
		header: SortButton,
		meta: {
			heading: "Req AGI",
		},
	}),

	columnHelper.accessor("reqSta", {
		header: SortButton,
		meta: {
			heading: "Req STA",
		},
	}),
	columnHelper.accessor("reqStr", {
		header: SortButton,
		meta: {
			heading: "Req STR",
		},
	}),
	columnHelper.accessor("reqInt", {
		header: SortButton,
		meta: {
			heading: "Req INT",
		},
	}),
	columnHelper.accessor("reqAgi", {
		header: SortButton,
		meta: {
			heading: "Req AGI",
		},
	}),
	columnHelper.accessor("armor", {
		header: SortButton,
	}),
	columnHelper.display({
		id: "stats",
		header: "Bonus Stats",
		cell: ({ row }) => <ItemStats stats={row.original} />,
	}),
	// columnHelper.display({
	// 	id: "req-stats",
	// 	header: "Req",
	// 	cell: ({ row }) => <ItemRequiredStats stats={row.original} />,
	// }),
	columnHelper.display({
		id: "damage",
		header: SortButton,
		cell: ({ row }) => (
			<DmgRange min={row.original.dmgMin} max={row.original.dmgMax} />
		),
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
		cell: (info) => {
			const sp = info.getValue();
			return sp && sp * 1000;
		},
	}),
	columnHelper.accessor("sellPrice", {
		header: "Sell Price",
		cell: (info) => <PriceDisplay size="xs" count={info.getValue()} />,
	}),
	columnHelper.display({
		id: "droppedBy",
		header: "Dropped By",
		cell: ({ row }) => <DroppedByList mobs={row.original.droppedBy} />,
	}),
	columnHelper.display({
		id: "soldBy",
		header: "Sold By",
		cell: ({ row }) => <SoldByList npcs={row.original.soldBy} />,
	}),
	columnHelper.display({
		id: "craftedBy",
		header: "Crafted By",
		cell: ({ row }) => <CraftedByList npcs={row.original.craftedBy} />,
	}),
	columnHelper.accessor("globalLoot", {
		header: "Global Drop",
		cell: (info) =>
			info.getValue() ? (
				<div className="flex items-center justify-center">
					<Check className="size-5" />
				</div>
			) : null,
	}),
	columnHelper.accessor("twoHand", {
		header: "Two Handed",
		cell: (info) =>
			info.getValue() ? (
				<div className="flex items-center justify-center">
					<Check className="size-5" />
				</div>
			) : null,
	}),
	columnHelper.accessor("consumable", {
		header: "Consumable",
		cell: (info) =>
			info.getValue() ? (
				<div className="flex items-center justify-center">
					<Check className="size-5" />
				</div>
			) : null,
	}),
	columnHelper.accessor("stackSize", {
		header: SortButton,
		meta: {
			heading: "Stack Size",
		},
	}),
	columnHelper.accessor("artist", {
		header: SortButton,
	}),
	// @TODO crafts INTO column
	// @TODO battle passes column
	// @TODO skills column
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
] as ColumnDef<Datum, any>[];

function ItemSearchFilters() {
	const { resetPage } = useDataTableQueryParams();
	const [filters, setFilters] = useQueryStates(itemSearchParamParser);

	const form = useZodForm({
		schema: itemSearchFilterSchema,
		values: filters,
	});

	return (
		<Form
			handleSubmit={(values) => {
				resetPage();
				setFilters(values);
			}}
			persist
			form={form}
			className="flex-1 flex h-full flex-col gap-y-8"
		>
			<RangeField
				label="Level Req"
				control={form.control}
				nameMax="maxLevel"
				nameMin="minLevel"
				maxValue={LEVEL_CAP}
			/>

			<Controller
				control={form.control}
				name="equipTypes"
				render={({ field }) => (
					<div className="space-y-3">
						<Label>Equip Slot</Label>
						<ScrollArea className="h-40 rounded-lg border shadow-sm">
							<Command>
								<CommandList>
									{equipTypeOptions.map(({ name, value }) => (
										<CommandItem
											key={value}
											value={value}
											className="capitalize"
											onSelect={(c) => {
												const oldVal = field.value;
												if (oldVal?.includes(c as EquippableType)) {
													field.onChange(oldVal.filter((o) => o !== c));
												} else {
													field.onChange([...(oldVal ?? []), c]);
												}
											}}
										>
											<Check
												className={cn(
													"mr-2 h-4 w-4",
													field.value?.includes(value)
														? "opacity-100"
														: "opacity-0",
												)}
											/>
											{name}
										</CommandItem>
									))}
								</CommandList>
							</Command>
						</ScrollArea>
					</div>
				)}
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

export function ItemTable({
	initialData,
	initialParams,
}: { initialData: AllItemsResponse; initialParams: AllItemsInput }) {
	const [tableParams] = useQueryStates(dataTableSearchParams);
	const [filters] = useQueryStates(itemSearchParamParser);
	const params = { ...filters, ...tableParams };

	const { data } = api.item.getAllPopulated.useQuery(params, {
		initialData: shallowCompare(params, initialParams)
			? initialData
			: undefined,
		placeholderData: keepPreviousData,
	});

	return (
		<DataTable
			title="Items"
			data={data ?? { data: [], totalCount: 0 }}
			columns={columns}
			filtersComponent={<ItemSearchFilters />}
			defaultColumnVisibility={{
				agi: false,
				int: false,
				sta: false,
				str: false,
				reqStr: false,
				reqInt: false,
				reqSta: false,
				reqAgi: false,
				damage: false,
				atkSpeed: false,
				desc: false,
				soldBy: false,
				craftedBy: false,
				twoHand: false,
				consumable: false,
				globalLoot: false,
				stackSize: false,
				artist: false,
			}}
		/>
	);
}
