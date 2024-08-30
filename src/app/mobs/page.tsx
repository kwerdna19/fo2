import type { SearchParams } from "nuqs/server";
import { MobTable } from "~/features/mobs/components/MobTable";
import { getAllMobs } from "~/features/mobs/requests";

export const metadata = {
	title: "Mobs",
};

export const revalidate = 86400;

export default async function Mobs({
	searchParams,
}: { searchParams: SearchParams }) {
	const result = await getAllMobs(searchParams);

	return <MobTable data={result} />;
}
