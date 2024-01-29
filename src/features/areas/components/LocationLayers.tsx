"use client";
import * as L from "leaflet";
import Link from "next/link";
import { LayerGroup, LayersControl, Marker, Popup } from "react-leaflet";
import { spriteHeight, spriteWidth } from "../../../components/MobSprite";
import { DropsList } from "../../../components/tables/mobs/DropsList";
import { MobHealth } from "../../../components/tables/mobs/MobHealth";
import { SaleItemsList } from "../../../components/tables/npcs/SaleItemsList";
import { type getAreaBySlug } from "../requests";

type Locations = NonNullable<
	Awaited<ReturnType<typeof getAreaBySlug>>
>["locations"];

export function LocationLayers({
	id,
	locations,
}: { id: string; locations: Locations }) {
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
									html: `<div id="${id}-${mob.id}-${i}" style="background-image: url(${mob.spriteUrl})"></div>`,
									className: "pixelated map-sprite-icon",
									iconSize: [spriteWidth * 2, spriteHeight * 2],
									iconAnchor: [spriteWidth, spriteHeight * 2],
									popupAnchor: [0, -spriteHeight],
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
												href={`/mobs/${mob.slug}`}
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
									html: `<div id="${id}-${npc.id}-${i}" style="background-image: url(${npc.spriteUrl})"></div>`,
									className: "pixelated map-sprite-icon",
									iconSize: [spriteWidth * 2, spriteHeight * 2],
									iconAnchor: [spriteWidth, spriteHeight * 2],
									popupAnchor: [0, -spriteHeight],
								})}
							>
								<Popup
									minWidth={
										npc.items?.length
											? 56 * (Math.min(npc.items.length, 6) || 1) + 8
											: 72
									}
									closeButton={false}
								>
									<div className="p-2 pt-1 space-y-1 max-w-[344px]">
										<div className="flex items-center justify-between">
											<Link
												prefetch={false}
												href={`/npcs/${npc.slug}`}
												className="text-sm font-bold"
											>
												{npc.name}
											</Link>
										</div>
										{npc.items && npc.items.length > 0 ? (
											<SaleItemsList items={npc.items} size="sm" />
										) : null}
										{npc.type === "Shop" &&
										npc.items &&
										npc.items?.length > 0 ? null : (
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
