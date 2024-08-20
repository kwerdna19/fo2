import { notFound } from "next/navigation";
import { type SearchParams, createSearchParamsCache } from "nuqs/server";
import { ItemTable } from "~/features/items/components/ItemTable";
import { getAllItems } from "~/features/items/requests";
import {
	itemSearchFilterSchema,
	itemSearchParamParser,
} from "~/features/items/schemas";

export const metadata = {
	title: "Items",
};

export const revalidate = 86400;

const itemSearchParamCache = createSearchParamsCache(itemSearchParamParser);

export default async function Items({
	searchParams,
}: { searchParams: SearchParams }) {
	const parsedInput = itemSearchParamCache.parse(searchParams);
	const filters = itemSearchFilterSchema.parse(parsedInput);
	const [data, err] = await getAllItems(filters);
	if (err) {
		notFound();
	}

	return <ItemTable data={data} />;
}
