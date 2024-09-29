import { Pencil } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminButton } from "~/components/AdminButton";
import { DurationDisplay } from "~/components/DurationDisplay";
import { IconSprite } from "~/components/IconSprite";
import { PriceDisplay } from "~/components/PriceDisplay";
import { Sprite } from "~/components/Sprite";
import {
	SpriteDownloadButton,
	SpritePreview,
} from "~/components/SpriteDownloadButton";
import { UnitSprite } from "~/components/UnitSprite";
import { Badge } from "~/components/ui/badge";
import { Label } from "~/components/ui/label";
import { CollectionButtons } from "~/features/collection/components/CollectionButtons";
import { ItemRequiredStats } from "~/features/items/components/ItemRequiredStats";
import { ItemStats } from "~/features/items/components/ItemStats";
import { auth } from "~/server/auth/auth";
import { api } from "~/trpc/server";
import { itemTypeMap } from "~/utils/fo-data/service";
import {
	getAverageDPS,
	isItemCollectible,
	isItemConsumable,
	isItemTwoHanded,
	isItemVisible,
	isWeapon,
} from "~/utils/fo-game";
import { getIdFromNameId, getNameIdSlug } from "~/utils/misc";

interface Params {
	nameId: string;
}

export async function generateMetadata({ params }: { params: Params }) {
	const item = await api.item.getById(getIdFromNameId(params.nameId));
	if (!item) {
		return {};
	}
	return {
		title: item.name,
	};
}

export default async function Item({ params }: { params: Params }) {
	const item = await api.item.getById(getIdFromNameId(params.nameId));

	const session = await auth();

	if (!item) {
		notFound();
	}

	const owned = Boolean(item.collections.at(0));

	const header = () => (
		<>
			<div className="flex gap-x-4">
				<h1 className="text-3xl">{item.name}</h1>
				<AdminButton
					size="icon"
					variant="outline"
					href={`/items/${getNameIdSlug(item)}/edit`}
				>
					<Pencil className="w-4 h-4" />
				</AdminButton>
			</div>
			{item.desc ? <p className="italic">{item.desc}</p> : <p>-</p>}
			{item.note ? <p className="py-2">{item.note}</p> : null}
		</>
	);

	const groupType = itemTypeMap[item.type];

	const subType = groupType?.subTypes?.[item.subType];

	return (
		<div className="grid lg:grid-cols-4 gap-8">
			<div className="lg:hidden space-y-2">{header()}</div>

			<div className="flex flex-col gap-6">
				<div className="self-center">
					<IconSprite bg size="2xl" url={item.spriteName} />
					<p className="text-muted-foreground pt-2 text-center">{item.name}</p>
				</div>
				<div>
					<Label>Slot</Label>
					<div className="flex items-center gap-4 flex-wrap capitalize">
						{groupType?.type.replace(/_/g, " ")?.toLowerCase() ?? "-"}
						{subType ? ` - ${subType.replace(/_/g, " ")?.toLowerCase()}` : null}
						{isWeapon(item) ? (
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
				{session && isItemCollectible(item) ? (
					<CollectionButtons id={item.id} initialOwned={owned} />
				) : null}
			</div>

			<div className="lg:col-span-3 py-2">
				<div className="hidden lg:block space-y-2">{header()}</div>
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
											<Link
												prefetch={false}
												href={`/mob/${getNameIdSlug(mob)}`}
											>
												<Sprite type="MOB" url={mob.spriteName} size="sm" />
											</Link>
											<Link
												prefetch={false}
												href={`/mob/${getNameIdSlug(mob)}`}
											>
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
								{item.soldBy.map((npc) => {
									return (
										<div
											className="grid items-center grid-cols-[0.5fr_1fr_0.5fr] gap-3"
											key={npc.id}
										>
											<Link
												prefetch={false}
												href={`/npc/${getNameIdSlug(npc)}`}
											>
												<Sprite type="NPC" url={npc.spriteName} size="sm" />
											</Link>
											<Link
												prefetch={false}
												href={`/npc/${getNameIdSlug(npc)}`}
											>
												{npc.name}
											</Link>
											<div className="flex gap-2 items-center">
												<PriceDisplay
													unit={item.buyPriceUnit}
													count={item.buyPrice}
													size="sm"
												/>
											</div>
										</div>
									);
								})}
							</div>
						</div>
					)}

					{item.crafts.length > 0 && (
						<div>
							<h2 className="text-xl mb-2">Crafted By</h2>
							<div className="max-w-screen-md">
								{item.crafts.map(
									({ itemId, npcId, npc, price, unit, durationMinutes }) => {
										return (
											<div
												className="grid items-center grid-cols-[0.5fr_1fr_0.5fr_0.5fr] gap-3"
												key={`${itemId}_${npcId}`}
											>
												<Link
													prefetch={false}
													href={`/npc/${getNameIdSlug(npc)}`}
												>
													<Sprite type="NPC" url={npc.spriteName} size="sm" />
												</Link>
												<Link
													prefetch={false}
													href={`/npc/${getNameIdSlug(npc)}`}
												>
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

				{isItemVisible(item) ? (
					<div className="max-w-fit">
						<SpritePreview item={item} />
						<SpriteDownloadButton item={item} />
					</div>
				) : null}
			</div>
		</div>
	);
}
