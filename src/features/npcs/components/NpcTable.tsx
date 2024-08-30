"use client";

import { createColumnHelper } from "@tanstack/react-table";
import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { MobSprite } from "~/components/MobSprite";
import SortButton from "~/components/SortButton";
import { DataTable } from "~/components/data-table/data-table";
import { Badge } from "~/components/ui/badge";
import type { getAllNpcs } from "~/features/npcs/requests";
import { CraftItemsList, SaleItemsList } from "./SaleItemsList";

type AllNpcsResponse = Awaited<ReturnType<typeof getAllNpcs>>;
export type Datum = AllNpcsResponse["data"][number];
const columnHelper = createColumnHelper<Datum>();

export const columns = [
	columnHelper.display({
		id: "sprite",
		cell: ({ row }) => (
			<Link
				prefetch={false}
				href={`/npcs/${row.original.slug}`}
				className="flex justify-center items-center h-[64px] max-h-full overflow-hidden group-hover:overflow-visible"
			>
				<MobSprite
					url={row.original.spriteUrl}
					name={row.original.name}
					size="sm"
					className="-mt-[36px]"
				/>
			</Link>
		),
	}),
	columnHelper.accessor("name", {
		cell: (info) => (
			<Link prefetch={false} href={`/npcs/${info.row.original.slug}`}>
				{info.getValue()}
			</Link>
		),
		header: SortButton,
	}),
	columnHelper.accessor("type", {
		header: SortButton,
	}),
	columnHelper.accessor(
		(row) => row.locations.map((l) => l.area.name).join(","),
		{
			cell: ({ row }) => (
				<div className="flex flex-wrap gap-3">
					{row.original.locations.map(({ id, area }) => (
						<Link
							prefetch={false}
							href={`/areas/${area.slug}?npcId=${row.original.id}`}
							key={id}
						>
							<Badge>{area.name}</Badge>
						</Link>
					))}
				</div>
			),
			header: "Areas",
		},
	),
	columnHelper.display({
		id: "sells",
		header: "Sells",
		cell: ({ row }) => <SaleItemsList items={row.original.items} />,
	}),
	columnHelper.display({
		id: "crafts",
		header: "Crafts",
		cell: ({ row }) => <CraftItemsList items={row.original.crafts} />,
	}),
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
] as ColumnDef<Datum, any>[];

export function NpcTable({ data }: { data: AllNpcsResponse }) {
	return <DataTable title="Npcs" data={data} columns={columns} />;
}
