import type { SearchParams } from "nuqs/parsers";
import { NpcTable } from "~/features/npcs/components/NpcTable";
import { getAllNpcs } from "~/features/npcs/requests";

export const metadata = {
	title: "Npcs",
};

export const revalidate = 86400;

export default async function Npcs({
	searchParams,
}: { searchParams: SearchParams }) {
	const npcs = await getAllNpcs(searchParams);
	return <NpcTable data={npcs} />;
}
