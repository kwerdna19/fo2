"use client";

import { createColumnHelper } from "@tanstack/react-table";
import type { ColumnDef } from "@tanstack/react-table";
import SortButton from "~/components/SortButton";
import { DataTable } from "~/components/data-table/data-table";
import { useDataTableQueryOptions } from "~/components/data-table/use-data-table-query";
import { type RouterOutputs, api } from "~/trpc/react";
import type { TableProps } from "~/types/table";
import { artSearchParamParser } from "../search-params";

type ArtDatum = RouterOutputs["art"]["getAllPopulated"]["data"][number];
const columnHelper = createColumnHelper<ArtDatum>();

const artColumns = [
	// columnHelper.display({
	// 	id: "sprite",
	// 	cell: ({ row }) => (
	// 		<Link
	// 			className="flex justify-center"
	// 			prefetch={false}
	// 			href={`/skills/${row.original.slug}`}
	// 		>
	// 			<IconSprite
	// 				url={row.original.spriteUrl}
	// 				size="sm"
	// 				bg
	// 			/>
	// 		</Link>
	// 	),
	// }),
	columnHelper.accessor("name", {
		header: SortButton,
	}),
	columnHelper.accessor("desc", {}),
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
] as ColumnDef<ArtDatum, any>[];

export function ArtTable(props: TableProps<"art", "getAllPopulated">) {
	const { params, options } = useDataTableQueryOptions(
		artSearchParamParser,
		props,
	);
	const { data } = api.art.getAllPopulated.useQuery(params, options);

	return (
		<DataTable
			title="Art"
			data={data ?? { data: [], totalCount: 0 }}
			columns={artColumns}
		/>
	);
}
