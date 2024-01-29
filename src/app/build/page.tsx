import BuildPlayground from "~/components/builds/BuildPlayground";
import { getAllEquipment } from "~/features/items/requests";

export const metadata = {
	title: "Build",
};

export default async function Builds() {
	const items = await getAllEquipment();

	return <BuildPlayground items={items} />;
}
