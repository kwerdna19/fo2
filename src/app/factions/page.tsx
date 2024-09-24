import type { SearchParams } from "nuqs/server";
import { FactionTable } from "~/features/factions/components/FactionTable";
import { factionSearchParamCache } from "~/features/factions/search-params";
import { api } from "~/trpc/server";

export const metadata = {
	title: "Factions",
};

export default async function Factions({
	searchParams,
}: { searchParams: SearchParams }) {
	const input = factionSearchParamCache.parse(searchParams);
	const result = await api.faction.getAllPopulated(input);
	return <FactionTable initialParams={input} initialData={result} />;
}
