"use client";
import type { Mob, Npc } from "@prisma/client";
import * as L from "leaflet";
import Link from "next/link";
import { LayerGroup, LayersControl, Marker, Popup } from "react-leaflet";
import { ItemList } from "~/features/items/components/ItemList";
import { DropsList } from "~/features/mobs/components/DropsList";
import { MobHealth } from "~/features/mobs/components/MobHealth";
import type { RouterOutputs } from "~/trpc/react";
import { getSpriteFrameSize, getSpriteSrc } from "~/utils/fo-sprite";
import { getNameIdSlug } from "~/utils/misc";

type Locations = NonNullable<RouterOutputs["area"]["getById"]>["locations"];

const mobSprite = getSpriteFrameSize("MOB");

export function LocationLayers({
	id,
	locations,
}: { id: number; locations: Locations }) {
	const mobs = locations
		.filter((l) => l.mob && l.mobId)
		.map((l) => ({ ...l.mob, x: l.x, y: l.y, key: l.id }));
	const npcs = locations
		.filter((l) => l.npc && l.npcId)
		.map((l) => ({ ...l.npc, x: l.x, y: l.y, key: l.id }));

	return (
		<LayersControl position="topright">
			<LayersControl.Overlay checked name="Mobs">
				<LayerGroup>
					{mobs.map((mob, i) => {
						return (
							<Marker
								key={mob.key}
								position={[mob.y, mob.x]}
								alt={mob.name}
								icon={L.divIcon({
									html: `<div id="${id}-${mob.id}-${i}" style="background-image: url(${`https://art.fantasyonline2.com/textures/enemies/${mob.spriteName}.png`})"></div>`,
									className: "pixelated map-sprite-icon",
									iconSize: [mobSprite.width * 2, mobSprite.height * 2],
									iconAnchor: [mobSprite.width, mobSprite.height * 2],
									popupAnchor: [0, -mobSprite.height],
								})}
							>
								<Popup
									minWidth={56 * (mob?.drops?.length || 1) + 8}
									closeButton={false}
								>
									<div className="p-2 pt-1 space-y-1">
										<div className="flex items-center justify-between">
											<Link
												prefetch={false}
												href={`/mobs/${getNameIdSlug(mob as Mob)}`}
												className="text-sm font-bold"
											>
												{mob.name}
											</Link>
										</div>
										{mob?.drops && mob.drops.length > 0 ? (
											<DropsList size="sm" drops={mob.drops} infoInToolTip />
										) : null}
										<div className="flex items-center justify-between gap-x-4 pt-1">
											<div>Lv. {mob.level}</div>
											<MobHealth
												className="gap-x-1"
												iconClassName="w-3 h-3 -mt-1"
												health={mob.health ?? "?"}
											/>
										</div>
									</div>
								</Popup>
							</Marker>
						);
					})}
				</LayerGroup>
			</LayersControl.Overlay>
			<LayersControl.Overlay checked name="Npcs">
				<LayerGroup>
					{npcs.map((npc, i) => {
						return (
							<Marker
								key={npc.key}
								position={[npc.y, npc.x]}
								alt={npc.name}
								icon={L.divIcon({
									html: `<div id="${id}-${npc.id}-${i}" style="background-image: url(${getSpriteSrc("NPC", npc.spriteName as string)})"></div>`,
									className: "pixelated map-sprite-icon",
									iconSize: [mobSprite.width * 2, mobSprite.height * 2],
									iconAnchor: [mobSprite.width, mobSprite.height * 2],
									popupAnchor: [0, -mobSprite.height],
								})}
							>
								<Popup
									minWidth={
										npc.selling?.length
											? 56 * (Math.min(npc.selling.length, 6) || 1) + 8
											: 72
									}
									closeButton={false}
								>
									<div className="p-2 pt-1 space-y-1 max-w-[344px]">
										<div className="flex items-center justify-between">
											<Link
												prefetch={false}
												href={`/npcs/${getNameIdSlug(npc as Npc)}`}
												className="text-sm font-bold"
											>
												{npc.name}
											</Link>
										</div>
										{npc.selling && npc.selling.length > 0 ? (
											<ItemList
												data={npc.selling}
												getAttributes={(item) => ({
													"Buy Price": {
														value: item.buyPrice,
														unit: item.buyPriceUnit,
													},
												})}
											/>
										) : null}
										{npc.type === "Shop" &&
										npc.selling &&
										npc.selling?.length > 0 ? null : (
											<div className="italic">{npc.type}</div>
										)}
									</div>
								</Popup>
							</Marker>
						);
					})}
				</LayerGroup>
			</LayersControl.Overlay>
		</LayersControl>
	);
}
