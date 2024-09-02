import BuildPlayground from "~/components/builds/BuildPlayground";
import { api } from "~/trpc/server";

export const metadata = {
	title: "Build",
};

export default async function Builds() {
	const items = await api.item.getAllEquipment();

	return <BuildPlayground items={items} />;
}
