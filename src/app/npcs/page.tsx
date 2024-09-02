import type { SearchParams } from "nuqs/parsers";
import { NpcTable } from "~/features/npcs/components/NpcTable";
import { npcSearchParamCache } from "~/features/npcs/search-params";
import { api } from "~/trpc/server";

export const metadata = {
	title: "Npcs",
};

export const revalidate = 86400;

export default async function Npcs({
	searchParams,
}: { searchParams: SearchParams }) {
	const npcs = await api.npc.getAllPopulated(
		npcSearchParamCache.parse(searchParams),
	);
	return <NpcTable data={npcs} />;
}
