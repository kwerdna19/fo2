"use client";

import { type SpriteSize, getSpriteStyle } from "~/utils/fo-sprite";
import { cn } from "~/utils/styles";

export interface SpriteProps {
	url: string;
	className?: string;
	animated?: boolean | "AUTO"; // auto means it will animate if the sprite can be animated
	size?: SpriteSize;
	type: "NPC" | "MOB" | "PLAYER";
}

export const Sprite = ({
	url,
	type,
	className,
	animated,
	size = "sm",
}: SpriteProps) => {
	const a = animated === "AUTO" ? ["PLAYER", "MOB"].includes(type) : animated;

	return (
		<div
			className={cn(className, "pixelated sprite", {
				"sprite-animated": a,
			})}
			style={getSpriteStyle(type, size, url)}
		/>
	);
};
