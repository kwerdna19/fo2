"use client";

import { Check, Loader2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "~/components/ui/tooltip";
import { api } from "~/trpc/react";

export function AddToCollectionButton({ id }: { id: string }) {
	const utils = api.useUtils();

	const router = useRouter();

	const { data: ownedMap } = api.collection.ownedMap.useQuery();

	const owned = Boolean(ownedMap?.[id]);

	const { mutate: add, isPending } = api.collection.addToCollection.useMutation(
		{
			// Always refetch after error or success:
			onSuccess: async () => {
				utils.collection.ownedMap.setData(undefined, (prev) => {
					if (!prev) {
						return prev;
					}
					return {
						...prev,
						[id]: 1,
					};
				});
				utils.collection.getMyCollection.invalidate();
			},
			onError: (err) => {
				if (err.data?.code === "UNAUTHORIZED") {
					router.push("/login");
				}
			},
		},
	);

	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						variant="outline"
						size="icon"
						onClick={() => add({ itemId: id })}
						className="self-center"
						disabled={isPending || owned}
					>
						{isPending ? (
							<Loader2 className="size-4 animate-spin" />
						) : owned ? (
							<Check className="size-4" />
						) : (
							<Plus className="size-4" />
						)}
						<span className="sr-only">
							{owned ? "Already in" : "Add to"} collection
						</span>
					</Button>
				</TooltipTrigger>
				<TooltipContent>
					<p>Add to collection</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}
