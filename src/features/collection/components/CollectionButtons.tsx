"use client";

import { XIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";

export function CollectionButtons({
	id,
	initialOwned,
}: { id: number; initialOwned: boolean }) {
	const { data: ownedMap } = api.collection.ownedMap.useQuery();

	const owned = !ownedMap ? initialOwned : Boolean(ownedMap[id]);

	const utils = api.useUtils();

	const { mutate: add } = api.collection.addToCollection.useMutation({
		onMutate: async (input) => {
			await utils.collection.ownedMap.cancel();

			const prevData = utils.collection.ownedMap.getData();

			// Snapshot the previous value
			const previousOwned = prevData ? Boolean(prevData?.[id]) : initialOwned;

			// Optimistically update to the new value
			utils.collection.ownedMap.setData(undefined, (prev) => {
				if (!prev) {
					return prev;
				}
				return {
					...prev,
					[id]: 1,
				};
			});

			// Return a context with the previous and new todo
			return { previousOwned, input };
		},
		// If the mutation fails, use the context we returned above
		onError: (err, input, context) => {
			if (context) {
				utils.collection.ownedMap.setData(undefined, (prev) => {
					if (!prev) {
						return prev;
					}
					return {
						...prev,
						[id]: context.previousOwned ? 1 : 0,
					};
				});
			}
			// show toast
		},
		// Always refetch after error or success:
		onSettled: (input) => {
			utils.collection.ownedMap.invalidate();
		},
		onSuccess: () => {
			utils.collection.getMyCollection.invalidate();
		},
	});
	const { mutate: remove } = api.collection.removeFromCollection.useMutation({
		onMutate: async (input) => {
			await utils.collection.ownedMap.cancel();

			const prevData = utils.collection.ownedMap.getData();

			// Snapshot the previous value
			const previousOwned = prevData ? Boolean(prevData?.[id]) : initialOwned;

			// Optimistically update to the new value
			utils.collection.ownedMap.setData(undefined, (prev) => {
				if (!prev) {
					return prev;
				}
				return {
					...prev,
					[id]: 0,
				};
			});

			// Return a context with the previous and new todo
			return { previousOwned, input };
		},
		// If the mutation fails, use the context we returned above
		onError: (err, input, context) => {
			if (context) {
				utils.collection.ownedMap.setData(undefined, (prev) => {
					if (!prev) {
						return prev;
					}
					return {
						...prev,
						[id]: context.previousOwned ? 1 : 0,
					};
				});
			}
			// show toast
		},
		// Always refetch after error or success:
		onSettled: (input) => {
			utils.collection.ownedMap.invalidate();
		},
		onSuccess: () => {
			utils.collection.getMyCollection.invalidate();
		},
	});

	return (
		<div className="flex flex-col gap-y-4 p-3">
			<Button disabled={owned} onClick={() => add({ itemId: id })}>
				{owned ? "In Collection" : "Add to Collection"}
			</Button>
			{owned && (
				<Button
					variant="outline"
					size="sm"
					onClick={() => remove({ itemId: id })}
					className="self-center"
				>
					<XIcon className="size-4 mr-2  text-destructive" />
					Remove
				</Button>
			)}
		</div>
	);
}
