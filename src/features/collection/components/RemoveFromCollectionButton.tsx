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
				utils.collection.isOwned.invalidate(input);
				utils.collection.getMyCollection.invalidate();
				utils.collection.getMyCollectionCount.setData(undefined, (prev) =>
					typeof prev === "number" ? prev - 1 : prev,
				);
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
