"use client";

import { createColumnHelper } from "@tanstack/react-table";
import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { ItemSprite } from "~/components/ItemSprite";
import SortButton from "~/components/SortButton";
import { DataTable } from "~/components/data-table/data-table";
import { ItemRequiredStats } from "~/features/items/components/ItemRequiredStats";
import { ItemStats } from "~/features/items/components/ItemStats";
import type { RouterOutputs } from "~/trpc/react";

type AllSkillsResponse = RouterOutputs["skill"]["getAllPopulated"];

export type Datum = AllSkillsResponse["data"][number];
const columnHelper = createColumnHelper<Datum>();

export const columns = [
	columnHelper.display({
		id: "sprite",
		cell: ({ row }) => (
			<Link
				className="flex justify-center"
				prefetch={false}
				href={`/skills/${row.original.slug}`}
			>
				<ItemSprite
					url={row.original.spriteUrl}
					name={row.original.name}
					size="sm"
					bg
				/>
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
] as ColumnDef<Datum, any>[];

export function SkillTable({ data }: { data: AllSkillsResponse }) {
	return (
		<DataTable
			title="Skills"
			data={data}
			columns={columns}
			// filtersComponent={<MobSearchFilters />}
			// defaultColumnVisibility={{}}
		/>
	);
}
