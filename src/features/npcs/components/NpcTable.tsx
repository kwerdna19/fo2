"use client";

import { createColumnHelper } from "@tanstack/react-table";
import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { DurationDisplay } from "~/components/DurationDisplay";
import SortButton from "~/components/SortButton";
import { Sprite } from "~/components/Sprite";
import { DataTable } from "~/components/data-table/data-table";
import { useDataTableQueryOptions } from "~/components/data-table/use-data-table-query";
import { Badge } from "~/components/ui/badge";
import { ItemList } from "~/features/items/components/ItemList";
import { type RouterOutputs, api } from "~/trpc/react";
import type { TableProps } from "~/types/table";
import { getNameIdSlug } from "~/utils/misc";
import { npcSearchParamParser } from "../search-params";

type NpcDatum = RouterOutputs["npc"]["getAllPopulated"]["data"][number];
const columnHelper = createColumnHelper<NpcDatum>();

export const columns = [
	columnHelper.display({
		id: "sprite",
		cell: ({ row }) => (
			<Link
				prefetch={false}
				href={`/npcs/${getNameIdSlug(row.original)}`}
				className="flex justify-center items-center h-[64px] max-h-full overflow-hidden group-hover:overflow-visible"
			>
				<Sprite
					type="NPC"
					url={row.original.spriteName}
					size="sm"
					className="-mt-[36px]"
				/>
			</Link>
		),
	}),
	columnHelper.accessor("name", {
		cell: (info) => (
			<Link prefetch={false} href={`/npcs/${getNameIdSlug(info.row.original)}`}>
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
							href={`/areas/${getNameIdSlug(area)}?npcId=${row.original.id}`}
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
		cell: ({ row }) => (
			<ItemList
				data={row.original.selling}
				getAttributes={(item) => ({
					"Buy Price": {
						value: item.buyPrice,
						unit: item.buyPriceUnit,
					},
				})}
			/>
		),
	}),
	columnHelper.display({
		id: "crafts",
		header: "Crafts",
		cell: ({ row }) => (
			<ItemList
				data={row.original.crafts}
				getAttributes={(craft) => ({
					Cost: {
						value: craft.price,
						unit: craft.unit,
					},
					Duration: <DurationDisplay mins={craft.durationMinutes} />,
				})}
			/>
		),
	}),
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
] as ColumnDef<NpcDatum, any>[];

export function NpcTable(props: TableProps<"npc", "getAllPopulated">) {
	const { params, options } = useDataTableQueryOptions(
		npcSearchParamParser,
		props,
	);
	const { data } = api.npc.getAllPopulated.useQuery(params, options);

	return (
		<DataTable
			title="Npcs"
			data={data ?? { data: [], totalCount: 0 }}
			columns={columns}
		/>
	);
}
