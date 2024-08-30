"use client";

import type { Table } from "@tanstack/react-table";
import { Settings2 } from "lucide-react";

import { Button } from "~/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

interface DataTableViewOptionsProps<TData> {
	table: Table<TData>;
}

export function DataTableViewOptions<TData>({
	table,
}: DataTableViewOptionsProps<TData>) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" size="sm">
					<Settings2 className="mr-2 h-4 w-4" />
					View
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				align="end"
				className="w-[160px] max-h-72 overflow-y-auto"
			>
				{table
					.getAllColumns()
					.filter(
						(column) => column.getCanHide() && !column.columnDef.meta?.hidden,
					)
					.map((column) => {
						const label =
							typeof column.columnDef.header === "string"
								? column.columnDef.header
								: column.columnDef.meta?.heading ?? column.id;

						return (
							<DropdownMenuCheckboxItem
								key={column.id}
								onSelect={(e) => e.preventDefault()}
								checked={column.getIsVisible()}
								onCheckedChange={(value) => column.toggleVisibility(!!value)}
								className={label === column.id ? "capitalize" : ""}
							>
								{label}
							</DropdownMenuCheckboxItem>
						);
					})}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
