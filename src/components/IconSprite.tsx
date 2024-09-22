import {
	type SpriteSize,
	getSpriteSize,
	getSpriteSrc,
} from "~/utils/fo-sprite";
import { cn } from "~/utils/styles";

export interface IconSpriteProps {
	url: string;
	size?: SpriteSize;
	className?: string;
	bg?: boolean;
	type?: "MENU_BUTTON" | "ITEM" | "SKILL";
}

export const IconSprite = ({
	url,
	className,
	size = "xs",
	bg,
	type = "ITEM",
}: IconSpriteProps) => {
	return (
		<img
			style={getSpriteSize(type, size)}
			className={cn(
				"box-content pixelated",
				bg &&
					"border shadow-sm border-slate-200 bg-slate-50 dark:bg-slate-800 dark:border-slate-950 rounded-sm",
				className,
			)}
			src={getSpriteSrc(type, url)}
			alt=""
		/>
	);
};
