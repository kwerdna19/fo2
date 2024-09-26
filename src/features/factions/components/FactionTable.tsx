"use client";

import { createColumnHelper } from "@tanstack/react-table";
import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import SortButton from "~/components/SortButton";
import { DataTable } from "~/components/data-table/data-table";
import { useDataTableQueryOptions } from "~/components/data-table/use-data-table-query";
import { type RouterOutputs, api } from "~/trpc/react";
import type { TableProps } from "~/types/table";
import { getNameIdSlug } from "~/utils/misc";
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
	columnHelper.accessor("id", {
		header: SortButton,
		meta: {
			heading: "ID",
		},
	}),
	columnHelper.accessor("name", {
		header: SortButton,
		cell: (info) => (
			<Link
				prefetch={false}
				href={`/factions/${getNameIdSlug(info.row.original)}`}
			>
				{info.getValue()}
			</Link>
		),
	}),
	columnHelper.accessor("_count.mobs", {
		// header: SortButton,
		header: "# Mobs",
		meta: {
			sortFieldReplacement: "mobs",
		},
	}),
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
] as ColumnDef<FactionDatum, any>[];

export function FactionTable(props: TableProps<"faction", "getAllPopulated">) {
	const { params, options, searchParamOptions } = useDataTableQueryOptions(
		factionSearchParamParser,
		props,
		{ defaultSort: "id" },
	);
	const { data } = api.faction.getAllPopulated.useQuery(params, options);

	return (
		<DataTable
			title="Factions"
			data={data ?? { data: [], totalCount: 0 }}
			columns={skillColumns}
			searchParamOptions={searchParamOptions}
		/>
	);
}
