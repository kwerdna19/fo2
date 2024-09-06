"use client";
import { basename } from "path";
import type { Item } from "@prisma/client";
import { type Build, Slot, visibleEquipment } from "~/utils/fo-game";
import { MobSprite } from "../MobSprite";

export function CharacterPreview({
	className,
	build,
}: { build: Build; className?: string }) {
	const items = visibleEquipment
		.map((e) => build[Slot[e]])
		.filter(Boolean) as Item[];

	const itemSlugs = items.map((item) => item.spriteName);

	const url = `https://art.fantasyonline2.com/api/character/ss?f=body-0_eyes-standard-blue_nude-head${
		itemSlugs.length ? `_${itemSlugs.join("_")}` : ""
	}`;

	const alt = `Character wearing ${items.map((item) => item.name).join(", ")}`;

	return <MobSprite size="3xl" className={className} url={url} name={alt} />;
}
