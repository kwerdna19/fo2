"use client";

import { createColumnHelper } from "@tanstack/react-table";
import type { ColumnDef } from "@tanstack/react-table";
import SortButton from "~/components/SortButton";
import { DataTable } from "~/components/data-table/data-table";
import { useDataTableQueryOptions } from "~/components/data-table/use-data-table-query";
import { type RouterOutputs, api } from "~/trpc/react";
import type { TableProps } from "~/types/table";
import { factionSearchParamParser } from "../search-params";

type FactionDatum = RouterOutputs["faction"]["getAllPopulated"]["data"][number];
const columnHelper = createColumnHelper<FactionDatum>();

export const skillColumns = [
	// columnHelper.display({
	// 	id: "sprite",
	// 	cell: ({ row }) => (
	// 		<Link
	// 			className="flex justify-center"
	// 			prefetch={false}
	// 			href={`/skills/${row.original.slug}`}
	// 		>
	// 			<IconSprite type="SKILL" url={row.original.spriteName} size="sm" bg />
	// 		</Link>
	// 	),
	// }),
	columnHelper.accessor("inGameId", {
		header: SortButton,
		meta: {
			heading: "ID",
		},
	}),
	columnHelper.accessor("name", {
		header: SortButton,
		meta: {
			sortFieldReplacement: "slug",
		},
	}),
	columnHelper.accessor("_count.mobs", {
		// header: SortButton,
		header: "# Mobs",
		meta: {
			sortFieldReplacement: "mobs",
		},
	}),
	columnHelper.accessor("slug", {
		meta: {
			hidden: true,
		},
	}),
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
] as ColumnDef<FactionDatum, any>[];

export function FactionTable(props: TableProps<"faction", "getAllPopulated">) {
	const { params, options } = useDataTableQueryOptions(
		factionSearchParamParser,
		props,
	);
	const { data } = api.faction.getAllPopulated.useQuery(params, options);

	return (
		<DataTable
			title="Factions"
			data={data ?? { data: [], totalCount: 0 }}
			columns={skillColumns}
		/>
	);
}