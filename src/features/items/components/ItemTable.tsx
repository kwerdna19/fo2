"use client";

import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";
import Link from "next/link";
import { useQueryStates } from "nuqs";
import { ItemSprite } from "~/components/ItemSprite";
import { PriceDisplay } from "~/components/PriceDisplay";
import { getSortButton } from "~/components/SortButton";

import { EquippableType } from "@prisma/client";
import type { ColumnDef } from "@tanstack/react-table";
import { CommandList } from "cmdk";
import { Check, ChevronDown, XIcon } from "lucide-react";
import { useState } from "react";
import { Controller } from "react-hook-form";
import { Pager } from "~/components/Pager";
import { SortSelect } from "~/components/SortSelect";
import { DataTable } from "~/components/data-table/data-table";
import RangeField from "~/components/form/RangeField";
import { TextField } from "~/components/form/TextField";
import { Form, SubmitButton, useZodForm } from "~/components/form/zod-form";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "~/components/ui/collapsible";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
} from "~/components/ui/command";
import { Label } from "~/components/ui/label";
import { ScrollArea } from "~/components/ui/scroll-area";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "~/components/ui/table";
import { ToggleGroup, ToggleGroupItem } from "~/components/ui/toggle-group";
import type { getAllItems } from "~/features/items/requests";
import { useServerActionQuery } from "~/hooks/zsa";
import {
	LEVEL_CAP,
	getAverageDamage,
	getSumOfBasicStats,
	isWeapon,
} from "~/utils/fo";
import { cn } from "~/utils/styles";
import {
	itemSearchFilterSchema,
	itemSearchParamParser,
} from "../search-params";
import { DroppedByList } from "./DroppedByList";
import { ItemRequiredStats } from "./ItemRequiredStats";
import { ItemStats } from "./ItemStats";
import { SoldByList } from "./SoldByList";

type AllItemsResponse = Awaited<ReturnType<typeof getAllItems>>;

export type Datum = AllItemsResponse["data"][number];
const columnHelper = createColumnHelper<Datum>();

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const columns: ColumnDef<Datum, any>[] = [
	columnHelper.display({
		id: "sprite",
		header: () => null,
		cell: ({ row }) => (
			<Link prefetch={false} href={`/items/${row.original.slug}`}>
				<ItemSprite
					url={row.original.spriteUrl}
					name={row.original.name}
					size="md"
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
		header: "Name",
	}),
	columnHelper.accessor("levelReq", {
		header: "Level",
	}),
	// sort will be by sum of basic stats, using armor as a secondary sort
	columnHelper.accessor(
		(row) => getSumOfBasicStats(row) + (row.armor ?? 0) / 1_000_000,
		{
			id: "stats",
			header: "Stats",
			cell: ({ row }) => <ItemStats stats={row.original} />,
		},
	),
	columnHelper.display({
		id: "req-stats",
		header: "Req",
		cell: ({ row }) => <ItemRequiredStats stats={row.original} />,
	}),
	columnHelper.accessor(
		(row) => (isWeapon(row) ? getAverageDamage(row) : null),
		{
			id: "damage",
			header: "Damage",
			cell: ({ row }) =>
				isWeapon(row.original)
					? `${row.original.dmgMin}-${row.original.dmgMax}`
					: null,
		},
	),
	columnHelper.accessor("atkSpeed", {
		header: "Atk Speed",
		cell: (info) => {
			const sp = info.getValue();
			return sp && sp * 1000;
		},
	}),
	columnHelper.accessor("sellPrice", {
		header: "Sell Price",
		cell: (info) => <PriceDisplay count={info.getValue()} />,
	}),
	columnHelper.accessor(
		(row) => row.droppedBy.map((d) => d.mob.name).join(", "),
		{
			id: "dropped-by",
			header: "Dropped By",
			cell: ({ row }) => <DroppedByList mobs={row.original.droppedBy} />,
		},
	),
	columnHelper.accessor((row) => row.soldBy.map((d) => d.npc.name).join(", "), {
		id: "sold-by",
		header: "Sold By",
		cell: ({ row }) => <SoldByList npcs={row.original.soldBy} />,
	}),
];

const equipTypeOptions = Object.values(EquippableType)
	// .sort((a, b) => a.localeCompare(b))
	.map((type) => ({
		value: type,
		name: type.replace(/_/g, " ").replace("COSMETIC", "OUTFIT").toLowerCase(),
	}));

function ItemSearchFilters() {
	const [filters, setFilters] = useQueryStates(itemSearchParamParser);

	const form = useZodForm({
		schema: itemSearchFilterSchema,
		values: filters,
	});

	const hasFilters = false;

	return (
		<Form
			handleSubmit={(values) => setFilters(values)}
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

			{/* <Controller
				control={form.control}
				name="equipTypes"
				render={({ field }) => (
					<div className="space-y-3">
						<Label>Equip Slot</Label>
						<ScrollArea className="h-40 rounded-lg border shadow-md">
							<Command>
								<CommandList>
									{equipTypeOptions.map(({ name, value }) => (
										<CommandItem
											key={value}
											value={value}
											className="capitalize"
											onSelect={(c) => {
												const oldVal = field.value;
												if (oldVal?.includes(c)) {
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
			/> */}

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

export function ItemTable({ data }: { data: AllItemsResponse }) {
	return (
		<DataTable
			title="Items"
			data={data}
			columns={columns}
			filtersComponent={<ItemSearchFilters />}
			defaultColumnVisibility={
				{
					// TBD
				}
			}
		/>
	);
}
