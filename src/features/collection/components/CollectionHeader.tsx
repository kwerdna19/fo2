"use client";

import { Progress } from "~/components/ui/progress";
import { api } from "~/trpc/react";

export function CollectionHeader({
	initialCount,
	total,
}: { initialCount: number; total: number }) {
	const { data: owned } = api.collection.getMyCollectionCount.useQuery(
		undefined,
		{ initialData: initialCount },
	);

	const value = 100 * (owned / total);

	return (
		<div className="pb-4 px-2 space-y-2">
			<div>
				<div className="text-2xl">My Collection</div>
				<div className="text-sm text-muted-foreground">
					{owned}/{total} collected
				</div>
			</div>
			<Progress value={value} />
		</div>
	);
}
