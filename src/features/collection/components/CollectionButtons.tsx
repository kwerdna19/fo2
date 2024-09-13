"use client";

import { XIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";

export function CollectionButtons({
	id,
	initialOwned,
}: { id: string; initialOwned: boolean }) {
	const { data: owned } = api.collection.isOwned.useQuery(
		{ itemId: id },
		{ initialData: initialOwned },
	);

	const utils = api.useUtils();

	const { mutate: add } = api.collection.addToCollection.useMutation({
		onMutate: async (input) => {
			await utils.collection.isOwned.cancel(input);

			// Snapshot the previous value
			const previousOwned =
				utils.collection.isOwned.getData(input) ?? initialOwned;

			// Optimistically update to the new value
			utils.collection.isOwned.setData(input, true);

			// Return a context with the previous and new todo
			return { previousOwned, input };
		},
		// If the mutation fails, use the context we returned above
		onError: (err, input, context) => {
			if (context) {
				utils.collection.isOwned.setData(context.input, context.previousOwned);
			}
			// show toast
		},
		// Always refetch after error or success:
		onSettled: (input) => {
			utils.collection.isOwned.invalidate(input);
		},
		onSuccess: () => {
			utils.collection.getMyCollection.invalidate();
			utils.collection.getMyCollectionCount.setData(undefined, (prev) =>
				typeof prev === "number" ? prev + 1 : prev,
			);
		},
	});
	const { mutate: remove } = api.collection.removeFromCollection.useMutation({
		onMutate: async (input) => {
			await utils.collection.isOwned.cancel(input);

			// Snapshot the previous value
			const previousOwned =
				utils.collection.isOwned.getData(input) ?? initialOwned;

			// Optimistically update to the new value
			utils.collection.isOwned.setData(input, false);

			// Return a context with the previous and new todo
			return { previousOwned, input };
		},
		// If the mutation fails, use the context we returned above
		onError: (err, input, context) => {
			if (context) {
				utils.collection.isOwned.setData(context.input, context.previousOwned);
			}
			// show toast
		},
		// Always refetch after error or success:
		onSettled: (input) => {
			utils.collection.isOwned.invalidate(input);
		},
		onSuccess: () => {
			utils.collection.getMyCollection.invalidate();
			utils.collection.getMyCollectionCount.setData(undefined, (prev) =>
				typeof prev === "number" ? prev - 1 : prev,
			);
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
