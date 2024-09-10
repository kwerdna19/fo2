import type { SearchParams } from "nuqs/server";
import { MobTable } from "~/features/mobs/components/MobTable";
import { mobSearchParamCache } from "~/features/mobs/search-params";
import { api } from "~/trpc/server";

export const metadata = {
	title: "Mobs",
};

export default async function Mobs({
	searchParams,
}: { searchParams: SearchParams }) {
	const input = mobSearchParamCache.parse(searchParams);
	const result = await api.mob.getAllPopulated(input);
	return <MobTable initialParams={input} initialData={result} />;
}
