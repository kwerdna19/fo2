"use client";
import type { Item } from "@prisma/client";
import {
	type Build,
	Slot,
	getItemSpriteQuery,
	visibleEquipment,
} from "~/utils/fo-game";
import { Sprite } from "../Sprite";

export function CharacterPreview({
	className,
	build,
}: { build: Build; className?: string }) {
	const items = visibleEquipment
		.map((e) => build[Slot[e]])
		.filter(Boolean) as Item[];

	return (
		<Sprite
			type="PLAYER"
			size="2xl"
			className={className}
			url={getItemSpriteQuery(items)}
		/>
	);
}
