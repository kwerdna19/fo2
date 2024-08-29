import { cn } from "~/utils/styles";

const variants = {
	size: {
		xs: 1,
		sm: 2,
		md: 3,
		lg: 4,
		xl: 6,
		"2xl": 8,
	},
};

interface Variant {
	size?: keyof (typeof variants)["size"];
}

const menuSpriteWidth = 25;
const menuSpriteHeight = 25;

const spriteWidth = 22;
const spriteHeight = 22;

export interface ItemSpriteProps extends Variant {
	url: string;
	name?: string;
	className?: string;
	bg?: boolean;
	menuSprite?: boolean;
}

export const ItemSprite = ({
	url,
	name,
	className,
	size = "xs",
	bg,
	menuSprite,
}: ItemSpriteProps) => {
	const mult = variants.size[size];
	const height = (menuSprite ? menuSpriteHeight : spriteHeight) * mult;
	const width = (menuSprite ? menuSpriteWidth : spriteWidth) * mult;

	return (
		<img
			style={{ height, width, minWidth: width, minHeight: height }}
			className={cn(
				"box-content pixelated aspect-square",
				bg &&
					"border shadow-sm border-slate-200 bg-slate-50 dark:bg-slate-800 dark:border-slate-950 rounded-sm",
				className,
			)}
			src={url}
			alt={name ? `${name} sprite` : ""}
		/>
	);
};
