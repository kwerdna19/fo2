"use client";

import { createColumnHelper } from "@tanstack/react-table";
import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { IconSprite } from "~/components/IconSprite";
import SortButton from "~/components/SortButton";
import { DataTable } from "~/components/data-table/data-table";
import { useDataTableQueryOptions } from "~/components/data-table/use-data-table-query";
import { ItemRequiredStats } from "~/features/items/components/ItemRequiredStats";
import { ItemStats } from "~/features/items/components/ItemStats";
import { type RouterOutputs, api } from "~/trpc/react";
import type { TableProps } from "~/types/table";
import { skillSearchParamParser } from "../search-params";

type SkillDatum = RouterOutputs["skill"]["getAllPopulated"]["data"][number];
const columnHelper = createColumnHelper<SkillDatum>();

export const skillColumns = [
	columnHelper.display({
		id: "sprite",
		cell: ({ row }) => (
			<Link
				className="flex justify-center"
				prefetch={false}
				href={`/skills/${row.original.slug}`}
			>
				<IconSprite type="SKILL" url={row.original.spriteName} size="sm" bg />
			</Link>
		),
	}),
	columnHelper.accessor("name", {
		cell: (info) => (
			<Link prefetch={false} href={`/skills/${info.row.original.slug}`}>
				{info.getValue()}
			</Link>
		),
		header: SortButton,
		meta: {
			sortFieldReplacement: "slug",
		},
	}),
	columnHelper.accessor("slug", {
		meta: {
			hidden: true,
		},
	}),
	columnHelper.accessor("rank", {
		header: SortButton,
	}),
	columnHelper.display({
		id: "stats",
		header: "Stats",
		cell: ({ row }) => <ItemStats stats={row.original} />,
	}),
	columnHelper.display({
		id: "req-stats",
		header: "Req Stats",
		cell: ({ row }) => <ItemRequiredStats stats={row.original} />,
	}),
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
] as ColumnDef<SkillDatum, any>[];

export function SkillTable(props: TableProps<"skill", "getAllPopulated">) {
	const { params, options } = useDataTableQueryOptions(
		skillSearchParamParser,
		props,
	);
	const { data } = api.skill.getAllPopulated.useQuery(params, options);

	return (
		<DataTable
			title="Skills"
			data={data ?? { data: [], totalCount: 0 }}
			columns={skillColumns}
		/>
	);
}
