"use client";

import { Loader2, XIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";

export function RemoveFromCollectionButton({ id }: { id: string }) {
	const utils = api.useUtils();

	const { mutate: remove, isPending } =
		api.collection.removeFromCollection.useMutation({
			// Always refetch after error or success:
			onSuccess: (input) => {
				utils.collection.ownedMap.setData(undefined, (prev) => {
					if (!prev) {
						return prev;
					}
					return {
						...prev,
						[id]: 0,
					};
				});
				utils.collection.getMyCollection.invalidate();
			},
		});

	return (
		<Button
			variant="outline"
			size="icon"
			onClick={() => remove({ itemId: id })}
			className="self-center"
			disabled={isPending}
		>
			{isPending ? (
				<Loader2 className="size-4 animate-spin" />
			) : (
				<XIcon className="size-4 text-destructive" />
			)}
			<span className="sr-only">Remove</span>
		</Button>
	);
}
