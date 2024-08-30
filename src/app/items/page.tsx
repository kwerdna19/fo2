import type { SearchParams } from "nuqs/server";
import { ItemTable } from "~/features/items/components/ItemTable";
import { getAllItems } from "~/features/items/requests";

export const metadata = {
	title: "Items",
};

export const revalidate = 86400;

export default async function Items({
	searchParams,
}: { searchParams: SearchParams }) {
	const data = await getAllItems(searchParams);
	return <ItemTable data={data} />;
}
