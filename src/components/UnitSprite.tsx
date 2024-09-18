import type { Unit } from "@prisma/client";
import {
	type SpriteSize,
	getSpriteSize,
	getSpriteSrc,
} from "~/utils/fo-sprite";
import { cn } from "~/utils/styles";

export interface ItemSpriteProps {
	type: Unit;
	className?: string;
	size?: SpriteSize;
}

export const UnitSprite = ({
	type,
	className,
	size = "xs",
}: ItemSpriteProps) => {
	return (
		<img
			style={getSpriteSize("UNIT", size)}
			className={cn("pixelated", className)}
			src={getSpriteSrc("UNIT", type.toLowerCase())}
			alt={type}
		/>
	);
};
