import { EquippableType } from "@prisma/client";
import { Pencil } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { AdminButton } from "~/components/AdminButton";
import { DurationDisplay } from "~/components/DurationDisplay";
import { FormButton } from "~/components/FormButton";
import { ItemSprite } from "~/components/ItemSprite";
import { MobSprite } from "~/components/MobSprite";
import QueryParamToast from "~/components/QueryParamToast";
import { UnitSprite } from "~/components/UnitSprite";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { ItemRequiredStats } from "~/features/items/components/ItemRequiredStats";
import { ItemStats } from "~/features/items/components/ItemStats";
import { auth } from "~/server/auth/auth";
import { api } from "~/trpc/server";
import {
	getAverageDPS,
	getPlayerSpriteUrlPreview,
	isItemConsumable,
	isItemTwoHanded,
	isVisible,
	isWeapon,
} from "~/utils/fo-game";

interface Params {
	slug: string;
}

export async function generateMetadata({ params }: { params: Params }) {
	const item = await api.item.getBySlug(params);
	if (!item) {
		return {};
	}
	return {
		title: item.name,
	};
}

// export async function generateStaticParams() {
// 	const items = await api.item.getAllQuick();
// 	return items.map((item) => ({
// 		slug: item.slug,
// 	}));
// }

export default async function Item({ params }: { params: Params }) {
	const item = await api.item.getBySlug(params);

	if (!item) {
		notFound();
	}

	const header = (
		<>
			<div className="flex gap-x-4">
				<h1 className="text-3xl">{item.name}</h1>
				{/* <AdminButton
					size="icon"
					variant="outline"
					href={`/items/${params.slug}/edit`}
				>
					<Pencil className="w-4 h-4" />
				</AdminButton> */}
			</div>
			{item.desc ? <p className="italic">{item.desc}</p> : <p>-</p>}
			{item.note ? <p className="py-2">{item.note}</p> : null}
		</>
	);

	// async function addToCollectionAction() {
	// 	"use server";

	// 	const session = await auth();
	// 	if (!session || !session.user || !item) {
	// 		redirect("/login");
	// 	}

	// 	await addToCollection({
	// 		itemId: item.id,
	// 		userId: session.user.id,
	// 	});

	// 	redirect(`/items/${item.slug}?added`);
	// }

	return (
		<div className="grid lg:grid-cols-4 gap-8">
			<div className="lg:hidden space-y-2">{header}</div>

			<div className="flex flex-col gap-6">
				<div className="self-center">
					<ItemSprite bg size="2xl" url={item.spriteName} name={item.name} />
					<p className="text-muted-foreground pt-2 text-center">{item.name}</p>
				</div>
				<div>
					<Label>Slot</Label>
					<div className="flex items-center gap-4 flex-wrap capitalize">
						{item.equip?.replace(/_/g, " ")?.toLowerCase() ?? "-"}
						{item.equip === EquippableType.MAIN_HAND ? (
							<Badge>{isItemTwoHanded(item) ? "2" : "1"}-H</Badge>
						) : null}
					</div>
				</div>
				<div>
					<Label>Level Req</Label>
					<div>{item.levelReq ?? "-"}</div>
				</div>

				{isWeapon(item) ? (
					<div className="grid grid-cols-2 gap-3">
						<div className="space-y-2">
							<Label>Damage</Label>
							<div>
								{item.dmgMin} - {item.dmgMax}
							</div>
						</div>
						<div className="space-y-2">
							<Label>Attack Speed</Label>
							<div>{item.atkSpeed}</div>
						</div>
						<div className="space-y-2">
							<Label>Average DPS</Label>
							<div>{getAverageDPS(item).toFixed(2)}</div>
						</div>
						<div className="space-y-2">
							<Label>Range</Label>
							<div>{item.range}</div>
						</div>
					</div>
				) : null}

				<div className="space-y-6">
					<div className="space-y-2">
						<Label>Stats</Label>
						<ItemStats
							stats={item}
							className="items-start"
							fallback={
								<div className="text-muted-foreground leading-none">
									No bonus stats
								</div>
							}
						/>
					</div>
					<div className="space-y-2">
						<Label>Required Stats</Label>
						<ItemRequiredStats
							stats={item}
							className="items-start"
							fallback={
								<div className="text-muted-foreground leading-none">
									No bonus stats
								</div>
							}
						/>
					</div>
				</div>
				<div>
					<Label>Sell Price</Label>
					<div className="flex items-center gap-2">
						{item.sellPrice ? (
							<>
								<UnitSprite type="COINS" size="sm" />
								{item.sellPrice}
							</>
						) : (
							"-"
						)}
					</div>
				</div>
				<div>
					<Label>Stack size</Label>
					<div className="flex items-center gap-2">{item.stackSize}</div>
				</div>
				{isItemConsumable(item) ? (
					<div>
						<Badge>Consumable</Badge>
					</div>
				) : null}
				{/* <form action={addToCollectionAction}>
					<FormButton variant="outline">Add to Collection</FormButton>
				</form> */}
			</div>

			<div className="lg:col-span-3 py-2">
				<div className="hidden lg:block space-y-2">{header}</div>
				<div className="py-12 space-y-6">
					{item.droppedBy.length > 0 && (
						<div>
							<h2 className="text-xl mb-2">Dropped By</h2>
							<div className="max-w-screen-md">
								{item.droppedBy.map(({ itemId, mobId, mob, dropRate }) => {
									return (
										<div
											className="grid items-center grid-cols-[0.5fr_1fr_0.5fr] gap-3"
											key={`${itemId}_${mobId}`}
										>
											<Link prefetch={false} href={`/mob/${mob.slug}`}>
												<MobSprite
													url={mob.spriteName}
													name={mob.name}
													size="sm"
												/>
											</Link>
											<Link prefetch={false} href={`/mob/${mob.slug}`}>
												{mob.name}
											</Link>
											<div>{dropRate}%</div>
										</div>
									);
								})}
							</div>
						</div>
					)}

					{item.soldBy.length > 0 && (
						<div>
							<h2 className="text-xl mb-2">Sold By</h2>
							<div className="max-w-screen-md">
								{item.soldBy.map(({ itemId, npcId, npc, price, unit }) => {
									return (
										<div
											className="grid items-center grid-cols-[0.5fr_1fr_0.5fr] gap-3"
											key={`${itemId}_${npcId}`}
										>
											<Link prefetch={false} href={`/npc/${npc.slug}`}>
												<MobSprite
													url={npc.spriteUrl}
													name={npc.name}
													size="sm"
												/>
											</Link>
											<Link prefetch={false} href={`/npc/${npc.slug}`}>
												{npc.name}
											</Link>
											<div className="flex gap-2 items-center">
												<UnitSprite type={unit} size="sm" />
												{price}
											</div>
										</div>
									);
								})}
							</div>
						</div>
					)}

					{item.craftedBy.length > 0 && (
						<div>
							<h2 className="text-xl mb-2">Crafted By</h2>
							<div className="max-w-screen-md">
								{item.craftedBy.map(
									({ itemId, npcId, npc, price, unit, durationMinutes }) => {
										return (
											<div
												className="grid items-center grid-cols-[0.5fr_1fr_0.5fr_0.5fr] gap-3"
												key={`${itemId}_${npcId}`}
											>
												<Link prefetch={false} href={`/npc/${npc.slug}`}>
													<MobSprite
														url={npc.spriteUrl}
														name={npc.name}
														size="sm"
													/>
												</Link>
												<Link prefetch={false} href={`/npc/${npc.slug}`}>
													{npc.name}
												</Link>
												<div className="flex gap-2 items-center">
													<UnitSprite type={unit} size="sm" />
													{price}
												</div>
												<DurationDisplay
													className="gap-x-2"
													iconClass="h-4 w-4"
													mins={durationMinutes}
												/>
											</div>
										);
									},
								)}
							</div>
						</div>
					)}
				</div>

				{isVisible(item) ? (
					<div>
						<MobSprite
							animated
							size="2xl"
							url={getPlayerSpriteUrlPreview([item])}
						/>
					</div>
				) : null}
			</div>
		</div>
	);
}
