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
import { areaSearchParamParser } from "../search-params";

export type AreaDatum =
	RouterOutputs["area"]["getAllPopulated"]["data"][number];
const columnHelper = createColumnHelper<AreaDatum>();

export const areaColumns = [
	// columnHelper.display({
	// 	id: "sprite",
	// 	cell: ({ row }) => (
	// 		<Link
	// 			className="flex justify-center"
	// 			prefetch={false}
	// 			href={`/skills/${getNameIdSlug(row.original)}`}
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
				href={`/areas/${getNameIdSlug(info.row.original)}`}
			>
				{info.getValue()}
			</Link>
		),
	}),
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
] as ColumnDef<AreaDatum, any>[];

export function AreaTable(props: TableProps<"area", "getAllPopulated">) {
	const { params, options, searchParamOptions } = useDataTableQueryOptions(
		areaSearchParamParser,
		props,
		{ defaultSort: "id" },
	);
	const { data } = api.area.getAllPopulated.useQuery(params, options);

	return (
		<DataTable
			title="Areas"
			data={data ?? { data: [], totalCount: 0 }}
			columns={areaColumns}
			searchParamOptions={searchParamOptions}
		/>
	);
}
