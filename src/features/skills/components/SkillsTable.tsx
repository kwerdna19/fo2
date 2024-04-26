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
import { DebouncedInput } from "~/components/DebouncedInput";
import { ItemSprite } from "~/components/ItemSprite";
import { getSortButton } from "~/components/SortButton";
import { ItemRequiredStats } from "~/components/tables/items/ItemRequiredStats";
import { ItemStats } from "~/components/tables/items/ItemStats";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "~/components/ui/table";
import { cn } from "~/utils/styles";
import type { getAllSkills } from "../requests";

type Data = Awaited<ReturnType<typeof getAllSkills>>;

export type Datum = Data[number];
const columnHelper = createColumnHelper<Datum>();

export const columns = [
	columnHelper.display({
		id: "sprite",
		header: () => null,
		cell: ({ row }) => (
			<Link prefetch={false} href={`/skills/${row.original.slug}`}>
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
			<Link prefetch={false} href={`/skills/${info.row.original.slug}`}>
				{info.getValue()}
			</Link>
		),
		header: getSortButton("Name"),
	}),
	columnHelper.accessor("rank", {
		header: getSortButton("Rank"),
	}),
	columnHelper.display({
		id: "effect",
		header: "Effect",
		cell: ({ row }) => <ItemStats stats={row.original} />,
	}),
	columnHelper.display({
		id: "req-stats",
		header: "Req Stats",
		cell: ({ row }) => <ItemRequiredStats stats={row.original} />,
	}),
];

export function SkillTable({ data }: { data: Data }) {
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
