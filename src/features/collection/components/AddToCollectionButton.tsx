"use client";

import { Loader2, Plus } from "lucide-react";
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

	const { mutate: add, isPending } = api.collection.addToCollection.useMutation(
		{
			// Always refetch after error or success:
			onSuccess: (input) => {
				utils.collection.isOwned.invalidate(input);
				utils.collection.getMyCollection.invalidate();
				utils.collection.getMyCollectionCount.setData(undefined, (prev) =>
					typeof prev === "number" ? prev - 1 : prev,
				);
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
				<TooltipTrigger>
					<Button
						variant="outline"
						size="icon"
						onClick={() => add({ itemId: id })}
						className="self-center"
						disabled={isPending}
					>
						{isPending ? (
							<Loader2 className="size-4 animate-spin" />
						) : (
							<Plus className="size-4" />
						)}
						<span className="sr-only">Add to collection</span>
					</Button>
				</TooltipTrigger>
				<TooltipContent>
					<p>Add to collection</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}
