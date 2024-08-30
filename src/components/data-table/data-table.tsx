"use client";

import {
	type ColumnDef,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";
import {
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
} from "lucide-react";
import { Fragment, type ReactNode, useState } from "react";
import { Button } from "~/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "~/components/ui/table";
import { cn } from "~/utils/styles";
import { DataTableControlsToggle } from "./data-table-controls-toggle";
import { DataTableSearchBar } from "./data-table-search-bar";
import { DataTableSideBar } from "./data-table-sidebar";
import { pageSizeOptions } from "./data-table-utils";
import { DataTableViewOptions } from "./data-table-view-options";
import { useDataTableQueryParams } from "./use-data-table-query";

export function DataTable<T, Data extends { totalCount: number; data: T[] }>({
	data,
	columns,
	filtersComponent,
	title,
	defaultColumnVisibility,
}: {
	data: Data;
	columns: ColumnDef<T>[];
	filtersComponent?: ReactNode;
	title: string;
	defaultColumnVisibility?: Record<string, boolean>;
}) {
	const { totalCount, data: rows } = data;

	const [showControls, setShowControls] = useState(true);
	const { pagination, setPagination, sorting, setSorting, search, setSearch } =
		useDataTableQueryParams();

	const table = useReactTable({
		data: rows,
		columns,
		onSortingChange: setSorting,
		getCoreRowModel: getCoreRowModel(),
		rowCount: totalCount,
		onPaginationChange: setPagination,
		manualPagination: true,
		manualSorting: true,
		initialState: {
			columnVisibility: defaultColumnVisibility,
		},
		state: {
			pagination,
			sorting,
		},
	});

	return (
		<div className="flex w-full gap-4">
			<DataTableSideBar
				open={showControls}
				setOpen={setShowControls}
				title={`Filter ${title}`}
			>
				{filtersComponent}
			</DataTableSideBar>

			<div className="flex max-w-full flex-1 flex-col gap-4 overflow-hidden">
				<DataTableSearchBar search={search} setSearch={setSearch} />
				<div className="flex items-center gap-x-6 gap-y-2 justify-between flex-wrap">
					<div className="flex items-center gap-x-8">
						<DataTableControlsToggle
							controlsOpen={showControls}
							setControlsOpen={setShowControls}
						/>
						<div className="text-sm text-muted-foreground">
							Showing {table.getRowModel().rows.length.toLocaleString()} of{" "}
							{totalCount.toLocaleString()} {title.toLocaleLowerCase()}
						</div>
					</div>

					<DataTableViewOptions table={table} />
				</div>
				<Table>
					<TableHeader className="bg-muted/50 text-sm">
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow className="hover:bg-transparent" key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									if (header.column.columnDef.meta?.hidden) {
										return null;
									}

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
									<Fragment key={row.id}>
										<TableRow className="relative group">
											{row.getVisibleCells().map((cell) => {
												if (cell.column.columnDef.meta?.hidden) {
													return null;
												}

												return (
													<TableCell
														key={cell.id}
														className={cn({
															"py-1 px-2": cell.column.id === "sprite",
														})}
													>
														{flexRender(
															cell.column.columnDef.cell,
															cell.getContext(),
														)}
													</TableCell>
												);
											})}
										</TableRow>
									</Fragment>
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
				<div className="flex justify-end gap-x-12 flex-wrap">
					<Select
						value={table.getState().pagination.pageSize.toString()}
						onValueChange={(e) => table.setPageSize(Number(e))}
					>
						<SelectTrigger className="w-[110px]">
							<SelectValue placeholder="Per Page" />
						</SelectTrigger>
						<SelectContent>
							{pageSizeOptions.map((pageSize) => (
								<SelectItem key={pageSize} value={pageSize.toString()}>
									Show {pageSize}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<span className="flex items-center gap-1">
						<div>Page</div>
						<span className="font-bold">
							{table.getState().pagination.pageIndex + 1} of{" "}
							{table.getPageCount().toLocaleString()}
						</span>
					</span>
					<div className="flex items-center gap-x-4">
						<Button
							size="icon"
							variant="outline"
							onClick={() => table.firstPage()}
							disabled={!table.getCanPreviousPage()}
						>
							<ChevronsLeft className="size-5" />
						</Button>
						<Button
							size="icon"
							variant="outline"
							onClick={() => table.previousPage()}
							disabled={!table.getCanPreviousPage()}
						>
							<ChevronLeft className="size-5" />
						</Button>
						<Button
							size="icon"
							variant="outline"
							onClick={() => table.nextPage()}
							disabled={!table.getCanNextPage()}
						>
							<ChevronRight className="size-5" />
						</Button>
						<Button
							size="icon"
							variant="outline"
							onClick={() => table.lastPage()}
							disabled={!table.getCanNextPage()}
						>
							<ChevronsRight className="size-5" />
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
