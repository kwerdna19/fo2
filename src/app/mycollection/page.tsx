import { Role } from "@prisma/client";
import type { SearchParams } from "nuqs/server";
import { CollectionHeader } from "~/features/collection/components/CollectionHeader";
import { CollectionTable } from "~/features/collection/components/CollectionTable";
import { collectionSearchParamCache } from "~/features/collection/search-params";
import { userSatisfiesRoleOrRedirect } from "~/server/auth/roles";
import { api } from "~/trpc/server";

export const metadata = {
	title: "Items",
};

export default async function MyCollection({
	searchParams,
}: { searchParams: SearchParams }) {
	await userSatisfiesRoleOrRedirect(Role.USER, "/");

	const params = collectionSearchParamCache.parse(searchParams);
	const data = await api.collection.getMyCollection(params);

	const [totalCollectible, totalOwned] = await Promise.all([
		api.collection.getNumCollectibleItems(),
		api.collection.getMyCollectionCount(),
	]);

	return (
		<div>
			<CollectionHeader initialCount={totalOwned} total={totalCollectible} />
			<CollectionTable initialData={data} initialParams={params} />
		</div>
	);
}
