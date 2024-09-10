import type { SearchParams } from "nuqs/parsers";
import { NpcTable } from "~/features/npcs/components/NpcTable";
import { npcSearchParamCache } from "~/features/npcs/search-params";
import { api } from "~/trpc/server";
export const metadata = {
	title: "Npcs",
};

export default async function Npcs({
	searchParams,
}: { searchParams: SearchParams }) {
	const params = npcSearchParamCache.parse(searchParams);

	const data = await api.npc.getAllPopulated(params);
	return <NpcTable initialParams={params} initialData={data} />;
}
