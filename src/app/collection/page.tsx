import { Role } from "@prisma/client";
import { format } from "date-fns";
import { X } from "lucide-react";
import Link from "next/link";
import { FormButton } from "~/components/FormButton";
import { ItemSprite } from "~/components/ItemSprite";
import { Card } from "~/components/ui/card";
import { Progress } from "~/components/ui/progress";
import { userSatisfiesRoleOrRedirect } from "~/server/auth/roles";
import { api } from "~/trpc/server";

export const metadata = {
	title: "My Collection",
};

export default async function Collection() {
	await userSatisfiesRoleOrRedirect(Role.USER, "/login");

	const collection = await api.collection.getMyCollection();
	const possibleItems = await api.collection.getNumCollectibleItems();

	const p = Math.round(100 * (collection.length / possibleItems));

	async function removeItem(fd: FormData) {
		"use server";

		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		const itemId = fd.get("itemId")!.toString();
		await api.collection.removeFromCollection({ itemId });
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
							<ItemSprite bg size="sm" name={item.name} url={item.spriteName} />
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
			{/* <QueryParamToast
				name="removed"
				success="{placeholder} removed from collection"
			/> */}
		</div>
	);
}
