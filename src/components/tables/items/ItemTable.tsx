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
import { CommandList } from "cmdk";
import { Check, ChevronDown, XIcon } from "lucide-react";
import { useState } from "react";
import { Controller } from "react-hook-form";
import { Pager } from "~/components/Pager";
import { SortSelect } from "~/components/SortSelect";
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
import { getAllItems } from "~/features/items/requests";
import {
	itemSearchFilterSchema,
	itemSearchParamParser,
} from "~/features/items/schemas";
import { useServerActionQuery } from "~/hooks/zsa";
import {
	LEVEL_CAP,
	getAverageDamage,
	getSumOfBasicStats,
	isWeapon,
} from "~/utils/fo";
import { cn } from "~/utils/styles";
import { itemSorts } from "../../../features/items/schemas";
import { DroppedByList } from "./DroppedByList";
import { ItemRequiredStats } from "./ItemRequiredStats";
import { ItemStats } from "./ItemStats";
import { SoldByList } from "./SoldByList";

type Data = NonNullable<Awaited<ReturnType<typeof getAllItems>>[0]>;

export type Datum = Data["data"][0];
const columnHelper = createColumnHelper<Datum>();

export const columns = [
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

const ignoreKeys = ["page", "perPage", "sort", "sortDirection"];

const equipTypeOptions = Object.values(EquippableType)
	// .sort((a, b) => a.localeCompare(b))
	.map((type) => ({
		value: type,
		name: type.replace(/_/g, " ").replace("COSMETIC", "OUTFIT").toLowerCase(),
	}));

function ItemFiltersForm() {
	const [filters, setFilters] = useQueryStates(itemSearchParamParser);

	const form = useZodForm({
		schema: itemSearchFilterSchema.omit({
			page: true,
			perPage: true,
			sort: true,
			sortDirection: true,
		}),
		values: filters,
	});

	const hasFilters =
		Object.entries(filters).filter(
			([k, v]) => !ignoreKeys.includes(k) && v !== null,
		).length > 0;

	return (
		<Form
			handleSubmit={(values) => setFilters(values)}
			persist
			form={form}
			className="grid gap-6 grid-cols-4"
		>
			<TextField
				label="Keyword"
				control={form.control}
				setNullOnEmpty
				name="query"
				placeholder="Search by name..."
			/>
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
			/>

			<div className="col-span-full flex justify-end gap-6">
				{hasFilters && (
					<Button
						variant="outline"
						type="button"
						onClick={() =>
							setFilters({
								maxLevel: null,
								minLevel: null,
								equipTypes: null,
								query: null,
							})
						}
					>
						<XIcon className="h-4 w-4 mr-2" /> Clear
					</Button>
				)}
				<SubmitButton>Apply</SubmitButton>
			</div>
		</Form>
	);
}

export function ItemTable({ data: initialData }: { data: Data }) {
	const [filtersOpen, setFiltersOpen] = useState(true);
	const [filters, setFilters] = useQueryStates(itemSearchParamParser);

	const {
		data: { data, totalPages, totalCount },
	} = useServerActionQuery(getAllItems, {
		queryKey: ["getAllItems", filters],
		input: filters,
		initialData,
	});

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	const coupledFields = [["minLevel", "maxLevel"]] as const;

	const numToRemove = coupledFields.filter((fields) =>
		fields.every((f) => filters[f]),
	).length;

	const numFilters =
		Object.entries(filters).filter(
			([k, v]) => !ignoreKeys.includes(k) && v !== null,
		).length - numToRemove;

	return (
		<div className="w-full space-y-4">
			<Card className="w-full">
				<Collapsible open={filtersOpen} onOpenChange={setFiltersOpen}>
					<CollapsibleTrigger className="w-full px-6 py-4 flex justify-start items-center leading-none">
						Filters
						{numFilters > 0 && (
							<Badge variant="secondary" className="ml-3">
								{numFilters}
							</Badge>
						)}
						<ChevronDown
							className={cn(
								"ml-4 h-5 w-5 self-end transition-transform",
								filtersOpen && "rotate-180",
							)}
						/>
					</CollapsibleTrigger>
					<CollapsibleContent className="p-4 border-t">
						<ItemFiltersForm />
					</CollapsibleContent>
				</Collapsible>
			</Card>
			<div className="flex justify-between">
				<div className="text-sm text-muted-foreground px-3 flex items-end">
					Showing {data.length} of {totalCount} results
				</div>
				<SortSelect
					sorts={itemSorts}
					filters={filters}
					setFilters={setFilters}
				/>
			</div>
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id}>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext(),
													)}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => {
								return (
									<TableRow
										key={row.id}
										aria-expanded={row.getIsExpanded()}
										onClick={row.getToggleExpandedHandler()}
									>
										{row.getVisibleCells().map((cell) => {
											return (
												<TableCell
													key={cell.id}
													className={cn(
														"text-lg",
														cell.column.id === "dropped-by" && "p-0",
													)}
												>
													{flexRender(
														cell.column.columnDef.cell,
														cell.getContext(),
													)}
												</TableCell>
											);
										})}
									</TableRow>
								);
							})
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center"
								>
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<Pager
				page={filters.page}
				totalPages={totalPages}
				onChange={setFilters}
			/>
		</div>
	);
}
