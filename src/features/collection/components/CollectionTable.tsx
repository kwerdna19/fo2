"use client";

import { createColumnHelper } from "@tanstack/react-table";
import Link from "next/link";
import { IconSprite } from "~/components/IconSprite";
import SortButton from "~/components/SortButton";

import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "~/components/data-table/data-table";
import { useDataTableQueryOptions } from "~/components/data-table/use-data-table-query";
import { type RouterOutputs, api } from "~/trpc/react";
import type { TableProps } from "~/types/table";

import { format } from "date-fns";
import ItemSubType from "~/features/items/components/ItemSubType";
import ItemType from "~/features/items/components/ItemType";
import { getNameIdSlug } from "~/utils/misc";
import { collectionSearchParamParser } from "../search-params";
import { RemoveFromCollectionButton } from "./RemoveFromCollectionButton";

export type CollectionItemDatum =
	RouterOutputs["collection"]["getMyCollection"]["data"][number];
const columnHelper = createColumnHelper<CollectionItemDatum>();

export const collectionItemTableColumns = [
	columnHelper.accessor("spriteName", {
		header: "Sprite",
		cell: ({ row }) => (
			<Link
				className="flex justify-center items-center h-[64px]"
				prefetch={false}
				href={`/items/${getNameIdSlug(row.original)}`}
			>
				<IconSprite url={row.original.spriteName} size="sm" bg />
			</Link>
		),
	}),
	columnHelper.accessor("name", {
		cell: (info) => (
			<Link
				prefetch={false}
				href={`/items/${getNameIdSlug(info.row.original)}`}
			>
				{info.getValue()}
			</Link>
		),
		header: SortButton,
		meta: {
			sortFieldReplacement: "slug",
		},
	}),
	columnHelper.accessor("addedAt", {
		cell: (info) => format(info.getValue(), "PPp"),
		header: SortButton,
		meta: {
			heading: "Added On",
		},
	}),
	columnHelper.accessor("type", {
		cell: (info) => {
			return <ItemType type={info.getValue()} />;
		},
	}),
	columnHelper.accessor("subType", {
		header: "Subtype",
		cell: (info) => {
			return (
				<ItemSubType type={info.row.original.type} subType={info.getValue()} />
			);
		},
	}),
	columnHelper.display({
		id: "remove",
		cell: (info) => (
			<div className="text-center">
				<RemoveFromCollectionButton id={info.row.original.id} />
			</div>
		),
	}),

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
] as ColumnDef<CollectionItemDatum, any>[];

export function CollectionTable(
	props: TableProps<"collection", "getMyCollection">,
) {
	const { params, options, searchParamOptions } = useDataTableQueryOptions(
		collectionSearchParamParser,
		props,
		{ defaultSort: "addedAt" },
	);
	const { data } = api.collection.getMyCollection.useQuery(params, options);

	return (
		<DataTable
			title="Items"
			data={data ?? { data: [], totalCount: 0 }}
			columns={collectionItemTableColumns}
			searchParamOptions={searchParamOptions}
		/>
	);
}
