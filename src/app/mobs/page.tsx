import { notFound } from "next/navigation";
import {
	type SearchParams,
	createSearchParamsCache,
	parseAsInteger,
} from "nuqs/server";
import { MobTable } from "~/components/tables/mobs/MobTable";
import { getAllMobs, getAllMobsAction } from "~/features/mobs/requests";
import {
	mobSearchParamParser,
	paginationSearchParams,
} from "~/features/mobs/schemas";

export const metadata = {
	title: "Mobs",
};

export const revalidate = 86400;

const mobPaginationParamCache = createSearchParamsCache(mobSearchParamParser);

export default async function Mobs({
	searchParams,
}: { searchParams: SearchParams }) {
	const parsedInput = mobPaginationParamCache.parse(searchParams);
	console.log({ parsedInput });
	const [result, error] = await getAllMobsAction({
		pageIndex: parsedInput.page - 1,
		pageSize: parsedInput.per_page,
		sort: parsedInput.sort,
		sortDirection: parsedInput.sort_dir,
		query: parsedInput.query,
	});

	if (error) {
		notFound();
	}

	return <MobTable data={result} />;
}
