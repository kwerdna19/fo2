import { ItemTable } from "~/components/tables/items/ItemTable";
import { getAllItems } from "~/features/items/requests";

export const metadata = {
	title: "Items",
};

export const revalidate = 86400;

export default async function Mobs() {
	const items = await getAllItems();
	return <ItemTable data={items} />;
}
