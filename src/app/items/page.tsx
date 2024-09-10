import type { SearchParams } from "nuqs/server";
import { ItemTable } from "~/features/items/components/ItemTable";
import { itemSearchParamCache } from "~/features/items/search-params";
import { api } from "~/trpc/server";

export const metadata = {
	title: "Items",
};

export default async function Items({
	searchParams,
}: { searchParams: SearchParams }) {
	const params = itemSearchParamCache.parse(searchParams);
	const data = await api.item.getAllPopulated(params);

	return <ItemTable initialData={data} initialParams={params} />;
}
