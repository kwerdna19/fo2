import { Role } from "@prisma/client";
import type { SearchParams } from "nuqs/server";
import { CollectionHeader } from "~/features/collection/components/CollectionHeader";
import { CollectionTable } from "~/features/collection/components/CollectionTable";
import { collectionSearchParamCache } from "~/features/collection/search-params";
import { userSatisfiesRoleOrRedirect } from "~/server/auth/roles";
import { api } from "~/trpc/server";

export const metadata = {
	title: "My Collection",
};

export default async function MyCollection({
	searchParams,
}: { searchParams: SearchParams }) {
	await userSatisfiesRoleOrRedirect(Role.USER, "/login");

	const params = collectionSearchParamCache.parse(searchParams);
	const data = await api.collection.getMyCollection(params);

	const [totalCollectible, ownedMap] = await Promise.all([
		api.collection.getNumCollectibleItems(),
		api.collection.ownedMap(),
	]);

	const totalOwned = Object.values(ownedMap).reduce((acc, p) => {
		return acc + p;
	}, 0 as number);

	return (
		<div>
			<CollectionHeader initialCount={totalOwned} total={totalCollectible} />
			<CollectionTable initialData={data} initialParams={params} />
		</div>
	);
}
