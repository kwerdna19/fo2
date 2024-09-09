"use client";
import type { ColumnDef } from "@tanstack/react-table";
import { flexRender, getCoreRowModel } from "@tanstack/react-table";
import { useReactTable } from "@tanstack/react-table";
import { Fragment, useMemo } from "react";
import { cn } from "~/utils/styles";

type Props<T> = {
	columns: ColumnDef<T>[];
	datum: T;
	definitionFields: Array<keyof T>;
};

export function DefinitionView<T>({
	datum,
	columns,
	definitionFields,
}: Props<T>) {
	const data = useMemo(() => [datum], [datum]);

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		manualPagination: true,
		initialState: {
			pagination: {
				pageSize: 1,
			},
		},
	});

	return (
		<div className="flex flex-col gap-0.5 border p-0.5 text-sm">
			{table.getRowModel().rows.map((row) => {
				const cells = row.getVisibleCells().filter((cell) => {
					return definitionFields.some((field) => {
						return (
							field === cell.column.id ||
							!!cell.column.columnDef.meta?.sortTypes?.find(
								(s) => s.id === field,
							)
						);
					});
				});

				return (
					<Fragment key={row.id}>
						{cells.map((cell) => {
							const label =
								typeof cell.column.columnDef.header === "string"
									? cell.column.columnDef.header
									: cell.column.columnDef.meta?.heading ?? cell.column.id;

							return (
								<div
									className="grid grid-cols-1 md:grid-cols-4 gap-0.5"
									key={cell.column.id}
								>
									<div className="font-semibold capitalize border flex items-center min-w-32 col-span-1 px-2 py-0.5">
										{label}
									</div>
									<div className="border flex-1 flex items-center col-span-1 md:col-span-3 px-2 py-0.5 min-h-4">
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</div>
								</div>
							);
						})}
					</Fragment>
				);
			})}
		</div>
	);

	// return (
	// 	<Table>
	// 		<TableHeader className="bg-muted/50 text-sm capitalize">
	// 			{table.getHeaderGroups().map((headerGroup) => (
	// 				<TableRow className="hover:bg-transparent" key={headerGroup.id}>
	// 					{headerGroup.headers.map((header) => {
	// 						return (
	// 							<TableHead key={header.id}>
	// 								{header.isPlaceholder
	// 									? null
	// 									: flexRender(
	// 											header.column.columnDef.header,
	// 											header.getContext(),
	// 										)}
	// 							</TableHead>
	// 						);
	// 					})}
	// 				</TableRow>
	// 			))}
	// 		</TableHeader>
	// 		<TableBody>
	// 			{table.getRowModel().rows.map((row) => {
	// 				return (
	// 					<Fragment key={row.id}>
	// 						<TableRow className="relative group">
	// 							{row.getVisibleCells().map((cell) => {
	// 								return (
	// 									<TableCell key={cell.id}>
	// 										{flexRender(
	// 											cell.column.columnDef.cell,
	// 											cell.getContext(),
	// 										)}
	// 									</TableCell>
	// 								);
	// 							})}
	// 						</TableRow>
	// 					</Fragment>
	// 				);
	// 			})}
	// 		</TableBody>
	// 	</Table>
	// );
}
