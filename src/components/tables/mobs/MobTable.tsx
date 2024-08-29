"use client";

import {
	type PaginationState,
	type SortingState,
	createColumnHelper,
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
import Link from "next/link";
import { useQueryStates } from "nuqs";
import { type CSSProperties, Fragment, type ReactNode, useState } from "react";
import { TbCrown as Crown } from "react-icons/tb";
import SortButton from "~/components/SortButton";
import { Button } from "~/components/ui/button";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "~/components/ui/drawer";
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
import type { getAllMobsAction } from "~/features/mobs/requests";
import {
	mobSearchParamParser,
	paginationSearchParams,
} from "~/features/mobs/schemas";
import { useBreakpoint } from "~/hooks/useBreakpoint";
import { useServerActionQuery } from "~/hooks/zsa";
import { cn } from "~/utils/styles";
import {} from "../../../../tailwind.config";
import { MobSprite } from "../../MobSprite";
import { DropGold } from "./DropGold";
import { DropsList } from "./DropsList";
import { MobHealth } from "./MobHealth";
import { DataTableControlsToggle } from "./data-table-controls-toggle";
import { DataTableSearchBar } from "./data-table-search-bar";
import { DataTableViewOptions } from "./data-table-view-options";

type Res = NonNullable<Awaited<ReturnType<typeof getAllMobsAction>>[0]>;
type Data = Res["data"];

export type Datum = Data[number];
const columnHelper = createColumnHelper<Datum>();

export const columns = [
	columnHelper.display({
		id: "sprite",
		cell: ({ row }) => (
			<Link
				prefetch={false}
				href={`/mobs/${row.original.slug}`}
				className="flex justify-center items-center h-[62px] max-h-full overflow-hidden group-hover:overflow-visible"
			>
				<MobSprite
					url={row.original.spriteUrl}
					name={row.original.name}
					size="sm"
					className="-mt-[12px]"
				/>
			</Link>
		),
	}),
	columnHelper.accessor("name", {
		enableHiding: false,
		cell: (info) => (
			<Link prefetch={false} href={`/mobs/${info.row.original.slug}`}>
				{info.getValue()}
			</Link>
		),
		header: SortButton,
	}),
	columnHelper.accessor("level", {
		header: SortButton,
	}),
	columnHelper.accessor("boss", {
		header: SortButton,
		cell: ({ row }) =>
			row.original.boss ? (
				<div className="flex justify-center">
					<Crown className="h-5 w-5 text-yellow-600" />
				</div>
			) : null,
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
	columnHelper.display({
		id: "loot",
		header: "Loot",
		cell: ({ row }) => (
			<DropsList
				infoInToolTip
				size="sm"
				drops={row.original.drops}
				className="flex-nowrap"
			/>
		),
	}),
	columnHelper.display({
		id: "damage",
		cell: ({ row }) => (
			<div>
				{row.original.dmgMin}-{row.original.dmgMax}
			</div>
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
];

const sortReplacement: Record<string, string> = {
	name: "slug",
};

const getKeyFromValue = (obj: Record<string, string>, value: string) => {
	return Object.keys(obj).find((k) => obj[k] === value) ?? value;
};

const useTableQueryParams = () => {
	const [params, setParams] = useQueryStates(mobSearchParamParser, {
		shallow: false,
	});
	const sorting: SortingState = [
		{
			id: getKeyFromValue(sortReplacement, params.sort),
			desc: params.sort_dir === "desc",
		},
	];
	const setSorting = (
		param: SortingState | ((p: SortingState) => SortingState),
	) => {
		const [s] = typeof param === "function" ? param(sorting) : param;

		if (!s) {
			setParams({
				sort: null,
				sort_dir: null,
			});
			return;
		}
		setParams({
			sort: sortReplacement[s.id] ?? s.id,
			sort_dir: s.desc ? "desc" : "asc",
		});
	};

	const pagination: PaginationState = {
		pageIndex: params.page - 1,
		pageSize: params.per_page,
	};
	const setPagination = (
		param: PaginationState | ((p: PaginationState) => PaginationState),
	) => {
		const p = typeof param === "function" ? param(pagination) : param;

		setParams({
			page: p.pageIndex + 1,
			per_page: p.pageSize,
		});
	};

	const search = params.query ?? "";

	const setSearch = (s: string | undefined | null) => {
		setParams({
			query: !s ? null : s,
		});
	};

	return { pagination, setPagination, sorting, setSorting, search, setSearch };
};

function SideBar({
	title,
	open,
	setOpen,
	children,
}: {
	open: boolean;
	setOpen: (o: boolean) => void;
	children: ReactNode;
	title?: string;
}) {
	const isDesktop = useBreakpoint("lg");

	const description =
		"Make changes to your profile here. Click save when you're done.";

	if (isDesktop) {
		// desktop sidebar design TBD
		return (
			<div
				aria-hidden={!open}
				className="w-[calc(var(--sidebar-width)-var(--sidebar-gap))] aria-hidden:hidden p-3 border rounded-md"
			>
				<DrawerHeader className="text-left p-0 pb-4">
					<div className="text-lg font-semibold leading-none tracking-tight">
						{title}
					</div>
					{/* <div className="text-sm text-muted-foreground">{description}</div> */}
				</DrawerHeader>
				{children}
			</div>
		);
	}

	return (
		<>
			<Drawer open={open} onOpenChange={setOpen}>
				<DrawerContent className="block lg:hidden">
					<DrawerHeader className="text-left">
						<DrawerTitle>{title}</DrawerTitle>
						{/* <DrawerDescription>{description}</DrawerDescription> */}
					</DrawerHeader>
					<div className="px-4 pb-8 pt-0">{children}</div>
				</DrawerContent>
			</Drawer>
		</>
	);
}

export function MobTable({ data }: { data: Res }) {
	const { totalCount, data: rows } = data;

	const [showControls, setShowControls] = useState(true);
	const { pagination, setPagination, sorting, setSorting, search, setSearch } =
		useTableQueryParams();

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
			columnVisibility: {
				dmg: false,
				atkSpeed: false,
				numSpawns: false,
				spawnTimeSec: false,
				artist: false,
			},
		},
		state: {
			pagination,
			sorting,
		},
	});

	return (
		<div
			className="flex gap-4"
			style={
				{
					"--sidebar-width": "300px",
					"--sidebar-gap": "16px",
					gap: "var(--sidebar-gap)",
				} as CSSProperties
			}
		>
			<SideBar
				open={showControls}
				setOpen={setShowControls}
				title="Filter Mobs"
			>
				<div>stuff</div>
			</SideBar>

			<div
				className={cn(
					"space-y-4 flex-1 max-w-full",
					showControls ? "lg:max-w-[calc(100%-var(--sidebar-width))]" : "",
				)}
			>
				<DataTableSearchBar search={search} setSearch={setSearch} />
				<div className="flex items-center gap-x-6 gap-y-2 justify-between flex-wrap">
					<div className="flex items-center gap-x-8">
						<DataTableControlsToggle
							controlsOpen={showControls}
							setControlsOpen={setShowControls}
						/>
						<div className="text-sm text-muted-foreground">
							Showing {table.getRowModel().rows.length.toLocaleString()} of{" "}
							{totalCount.toLocaleString()} results
						</div>
					</div>

					<DataTableViewOptions table={table} />
				</div>
				<Table className="overflow-y-hidden">
					<TableHeader className="bg-muted/50 text-sm">
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow className="hover:bg-transparent" key={headerGroup.id}>
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
									<Fragment key={row.id}>
										<TableRow className="relative group">
											{row.getVisibleCells().map((cell) => {
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
							{[20, 50, 100].map((pageSize) => (
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
