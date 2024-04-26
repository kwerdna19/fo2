import { format } from "date-fns";
import { X } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { FormButton } from "~/components/FormButton";
import { ItemSprite } from "~/components/ItemSprite";
import QueryParamToast from "~/components/QueryParamToast";
import { Card } from "~/components/ui/card";
import { Progress } from "~/components/ui/progress";
import {
	getMyCollection,
	getNumCollectibleItems,
	removeFromCollection,
} from "~/features/collection/requests";
import { auth } from "~/server/auth";

export const metadata = {
	title: "My Collection",
};

export default async function Collection() {
	const session = await auth();
	if (!session?.user) {
		redirect("/login");
	}

	const collection = await getMyCollection();

	const possibleItems = await getNumCollectibleItems();

	const p = Math.round(100 * (collection.length / possibleItems));

	async function removeItem(fd: FormData) {
		"use server";

		const itemId = fd.get("itemId")?.toString();

		const session = await auth();
		if (!session || !session.user || !itemId) {
			redirect("/login");
		}

		const userId = session.user.id;

		const {
			item: { name },
		} = await removeFromCollection({ userId, itemId });

		redirect(`/collection?removed=true&placeholder=${name}`);
	}

	return (
		<div className="w-full space-y-3">
			<div className="flex gap-x-4">
				<h2 className="text-3xl">My Collection</h2>
			</div>

			<form
				action={removeItem}
				className="space-y-3 max-w-screen-sm w-full pb-8"
			>
				<div className="p-2 space-y-0.5">
					<p className="px-1">
						Collected {collection.length} of {possibleItems} collectible items
					</p>
					<Progress value={p} />
					<p className="text-xs text-muted-foreground px-1">{p}%</p>
				</div>
				{collection.map(({ item, addedAt }) => {
					return (
						<Card
							key={item.id}
							className="flex w-full p-5 gap-x-5 items-center text-lg"
						>
							<ItemSprite bg size="sm" name={item.name} url={item.spriteUrl} />
							<div className="flex-1">
								<Link href={`/items/${item.slug}`} prefetch={false}>
									{item.name}
								</Link>
								<p className="text-xs text-muted-foreground">
									Added: {format(addedAt, "PPp")}
								</p>
							</div>
							<div>
								<FormButton
									name="itemId"
									size="icon"
									variant="ghost"
									value={item.id}
									icon={<X className="h-5 w-5 text-destructive" />}
								/>
							</div>
						</Card>
					);
				})}
			</form>
			<QueryParamToast
				name="removed"
				success="{placeholder} removed from collection"
			/>
		</div>
	);
}
