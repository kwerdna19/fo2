import type { SearchParams } from "nuqs/server";
import { MobTable } from "~/features/mobs/components/MobTable";
import { mobSearchParamCache } from "~/features/mobs/search-params";
import { api } from "~/trpc/server";

export const metadata = {
	title: "Mobs",
};

export const revalidate = 86400;

export default async function Mobs({
	searchParams,
}: { searchParams: SearchParams }) {
	const result = await api.mob.getAllPopulated(
		mobSearchParamCache.parse(searchParams),
	);
	return <MobTable data={result} />;
}
