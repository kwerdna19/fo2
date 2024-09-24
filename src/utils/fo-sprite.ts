import type { Item } from "@prisma/client";
import { isItemVisible } from "./fo-game";

type SpriteConfig = {
	width: number;
	height: number;
	baseUrl: string;
	cols?: number;
	rows?: number;
};

const spriteSheetConfig = {
	PLAYER: {
		width: 102,
		height: 200,
		baseUrl: "https://art.fantasyonline2.com/api/character/ss?f=",
		cols: 3,
		rows: 4,
	},
	MOB: {
		width: 96,
		height: 192,
		baseUrl: "https://art.fantasyonline2.com/textures/enemies/",
		cols: 3,
		rows: 4,
	},
	NPC: {
		width: 96,
		height: 192,
		baseUrl: "https://art.fantasyonline2.com/textures/npcs/",
		cols: 3,
		rows: 4,
	},
	ITEM: {
		width: 22,
		height: 22,
		baseUrl: "https://art.fantasyonline2.com/textures/icons/items/",
	},
	SKILL: {
		width: 22,
		height: 22,
		baseUrl: "https://art.fantasyonline2.com/textures/icons/skills/",
	},
	MENU_BUTTON: {
		width: 25,
		height: 25,
		baseUrl: "https://art.fantasyonline2.com/textures/gui/",
	},
	UNIT: {
		width: 9,
		height: 8,
		baseUrl: "/sprites/unit/",
	},
} satisfies Record<string, SpriteConfig>;

export type SpriteType = keyof typeof spriteSheetConfig;

export const spriteSizeMap = {
	xs: 1,
	sm: 2,
	md: 4,
	lg: 6,
	xl: 9,
	"2xl": 12,
};

export type SpriteSize = keyof typeof spriteSizeMap;

export const getSpriteSrc = (
	spriteType: SpriteType,
	urlOrSpriteName: string,
) => {
	const { baseUrl } = spriteSheetConfig[spriteType];

	return urlOrSpriteName.startsWith("/") || urlOrSpriteName.startsWith("http")
		? urlOrSpriteName
		: `${baseUrl}${urlOrSpriteName}${spriteType === "ITEM" || spriteType === "SKILL" ? "-icon" : ""}${spriteType !== "PLAYER" ? ".png" : ""}`;
};

export const getSpriteSize = (spriteType: SpriteType, size: SpriteSize) => {
	const { width, height, ...rest } = spriteSheetConfig[spriteType];

	const c = "cols" in rest ? rest.cols : 1;
	const r = "rows" in rest ? rest.rows : 1;

	return {
		width: (width * spriteSizeMap[size]) / c,
		height: (height * spriteSizeMap[size]) / r,
	};
};

export const getSpriteStyle = (
	spriteType: SpriteType,
	size: SpriteSize,
	urlOrSpriteName: string,
) => {
	const src = getSpriteSrc(spriteType, urlOrSpriteName);

	const { width, height } = getSpriteSize(spriteType, size);

	return {
		backgroundImage: `url("${src}")`,
		width,
		height,
	};
};

export const getSpriteFrameSize = (spriteType: SpriteType) => {
	const { width, height, ...rest } = spriteSheetConfig[spriteType];

	const c = "cols" in rest ? rest.cols : 1;
	const r = "rows" in rest ? rest.rows : 1;

	return {
		width: width / c,
		height: height / r,
	};
};

export const getSpriteTypeFromImageSize = (input: {
	width: number;
	height: number;
}) => {
	for (const [key, value] of Object.entries(spriteSheetConfig)) {
		if (value.width === input.width && value.height === input.height) {
			return key as SpriteType;
		}
	}

	return null;
};

const defaultPlayerSpriteElements = [
	"body-1",
	"eyes-standard-blue",
	"hair-close-black",
];

const getItemSpriteLayer = (item: Pick<Item, "type" | "subType">) => {
	// all weapons and outfit weapons
	if (item.type === 2 || (item.type === 6 && item.subType === 16)) {
		return "!0";
	}

	// Armor or outfit off hand
	if (
		(item.type === 3 && item.subType === 17) ||
		(item.type === 6 && item.subType === 17)
	) {
		return "!1";
	}

	// Armor or outfit back
	if (
		(item.type === 3 && item.subType === 4) ||
		(item.type === 6 && item.subType === 4)
	) {
		return "!2";
	}

	return "";
};

export type PartialItem = Pick<Item, "spriteName" | "type" | "subType">;

const getItemSpriteQuery = (
	itemOrItems: PartialItem | PartialItem[],
	baseElements?: string[],
) => {
	const items = Array.isArray(itemOrItems) ? itemOrItems : [itemOrItems];

	const itemSlugs = items.filter(isItemVisible).map((item) => {
		return `${item.spriteName}${getItemSpriteLayer(item)}`;
	});

	const attrs = baseElements ? baseElements.concat(itemSlugs) : itemSlugs;
	return attrs.join("_");
};

export const getPlayerSpriteUrlPreview = (
	items: PartialItem | PartialItem[],
) => {
	return getSpriteSrc(
		"PLAYER",
		getItemSpriteQuery(items, defaultPlayerSpriteElements),
	);
};

export const getItemSpriteUrlPreview = (items: PartialItem) => {
	return getSpriteSrc("PLAYER", getItemSpriteQuery(items));
};
