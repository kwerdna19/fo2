"use client";

import {
	type ColumnFiltersState,
	type SortingState,
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	getExpandedRowModel,
	getFilteredRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import Link from "next/link";
import { useState } from "react";
import { ItemSprite } from "~/components/ItemSprite";
import { PriceDisplay } from "~/components/PriceDisplay";
import { getSortButton } from "~/components/SortButton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "~/components/ui/table";
import type { getAllItems } from "~/features/items/requests";
import { getAverageDamage, getSumOfBasicStats, isWeapon } from "~/utils/fo";
import { cn } from "~/utils/styles";
import { DebouncedInput } from "../../DebouncedInput";
import { DroppedByList } from "./DroppedByList";
import { ItemRequiredStats } from "./ItemRequiredStats";
import { ItemStats } from "./ItemStats";
import { SoldByList } from "./SoldByList";

type Data = Awaited<ReturnType<typeof getAllItems>>;

export type Datum = Data[number];
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
		header: getSortButton("Name"),
	}),
	columnHelper.accessor("levelReq", {
		header: getSortButton("Level"),
	}),
	// sort will be by sum of basic stats, using armor as a secondary sort
	columnHelper.accessor(
		(row) => getSumOfBasicStats(row) + (row.armor ?? 0) / 1_000_000,
		{
			id: "stats",
			header: getSortButton("Stats"),
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
			header: getSortButton("Damage"),
			cell: ({ row }) =>
				isWeapon(row.original)
					? `${row.original.dmgMin}-${row.original.dmgMax}`
					: null,
		},
	),
	columnHelper.accessor("atkSpeed", {
		header: getSortButton("Atk Speed"),
		cell: (info) => {
			const sp = info.getValue();
			return sp && sp * 1000;
		},
	}),
	columnHelper.accessor("sellPrice", {
		header: getSortButton("Sell Price"),
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

export function ItemTable({ data }: { data: Data }) {
	const [sorting, setSorting] = useState<SortingState>([]);

	const [globalFilter, setGlobalFilter] = useState("");
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

	const table = useReactTable({
		data: data ?? [],
		columns,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		onGlobalFilterChange: setGlobalFilter,
		getCoreRowModel: getCoreRowModel(),
		// getPaginationRowModel: getPaginationRowModel(),
		getExpandedRowModel: getExpandedRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getRowCanExpand: () => true,
		state: {
			sorting,
			columnFilters,
			globalFilter,
		},
	});

	return (
		<div className="w-full">
			<div className="flex items-center mb-4 gap-8">
				<DebouncedInput
					placeholder="Filter by mob or item..."
					value={globalFilter ?? ""}
					onChange={(value) => setGlobalFilter(String(value))}
					className="max-w-sm"
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
		</div>
	);
}
