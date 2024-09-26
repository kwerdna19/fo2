import { table } from "console";
import type { Column, Table } from "@tanstack/react-table";
import { ChevronsUpDown } from "lucide-react";
import type { ReactNode } from "react";
import React from "react";
import { TbArrowDown as ArrowDown, TbArrowUp as ArrowUp } from "react-icons/tb";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { cn } from "~/utils/styles";
import { Button } from "./ui/button";

export default function SortButton<T>({
	column,
	table,
}: {
	table: Table<T>;
	column: Column<T>;
}) {
	const label =
		typeof column.columnDef.header === "string"
			? column.columnDef.header
			: (column.columnDef.meta?.heading ?? column.id);

	const isId = column.id === label;
	const types = column.columnDef.meta?.sortTypes;
	const className = cn(
		"-ml-1 h-8 data-[state=open]:bg-accent",
		isId && "capitalize",
	);

	if (types && types.length > 0) {
		const currentSort = table.getState().sorting.at(0);

		const isSorted =
			!!currentSort && types.some((t) => t.id === currentSort.id);

		const isDesc = isSorted && currentSort.desc;
		const isAsc = isSorted && !currentSort.desc;

		return (
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" size="sm" className={className}>
						<span>{label}</span>
						{isDesc ? (
							<ArrowUp className="ml-2 h-4 w-4" />
						) : isAsc ? (
							<ArrowDown className="ml-2 h-4 w-4" />
						) : (
							<ChevronsUpDown className="ml-2 h-4 w-4" />
						)}
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="start">
					{types.map((t) => {
						return (
							<React.Fragment key={t.id}>
								<DropdownMenuItem
									onClick={() => table.setSorting([{ id: t.id, desc: false }])}
								>
									<ArrowDown className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
									{t.name} - Asc
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={() => table.setSorting([{ id: t.id, desc: true }])}
								>
									<ArrowUp className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
									{t.name} - Desc
								</DropdownMenuItem>
							</React.Fragment>
						);
					})}
				</DropdownMenuContent>
			</DropdownMenu>
		);
	}

	const sortFieldId = column.columnDef.meta?.sortFieldReplacement;

	const sortCol = sortFieldId
		? (table.getColumn(sortFieldId) ?? column)
		: column;

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="sm" className={className}>
					<span>{label}</span>
					{sortCol.getIsSorted() === "desc" ? (
						<ArrowUp className="ml-2 h-4 w-4" />
					) : sortCol.getIsSorted() === "asc" ? (
						<ArrowDown className="ml-2 h-4 w-4" />
					) : (
						<ChevronsUpDown className="ml-2 h-4 w-4" />
					)}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="start">
				<DropdownMenuItem onClick={() => sortCol.toggleSorting(false)}>
					<ArrowDown className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
					Asc
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => sortCol.toggleSorting(true)}>
					<ArrowUp className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
					Desc
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
