import {
	type SpriteSize,
	getSpriteSize,
	getSpriteSrc,
} from "~/utils/fo-sprite";
import { cn } from "~/utils/styles";

export interface ItemSpriteProps {
	url: string;
	size?: SpriteSize;
	className?: string;
	bg?: boolean;
	menuSprite?: boolean;
}

export const ItemSprite = ({
	url,
	className,
	size = "xs",
	bg,
	menuSprite,
}: ItemSpriteProps) => {
	const type = menuSprite ? "MENU_BUTTON" : "ITEM";

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
