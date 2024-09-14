import type { SearchParams } from "nuqs/parsers";
import { ArtTable } from "~/features/art/components/ArtTable";
import { artSearchParamCache } from "~/features/art/search-params";
import { api } from "~/trpc/server";

export const metadata = {
	title: "Art",
};

export default async function Skills({
	searchParams,
}: { searchParams: SearchParams }) {
	const params = artSearchParamCache.parse(searchParams);
	const data = await api.art.getAllPopulated(params);
	return <ArtTable initialData={data} initialParams={params} />;
}
