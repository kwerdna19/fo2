type SpriteConfig = {
	width: number;
	height: number;
};

export const defaultSprite = { row: 2, col: 1 }; // 0 indexed

export const spriteSheetSize = { rows: 4, cols: 3 };

export const spriteConfig: Record<string, SpriteConfig> = {
	PLAYER: {
		width: 102,
		height: 200,
	},
	MOB: {
		width: 96,
		height: 192,
	},
	NPC: {
		width: 96,
		height: 192,
	},
	ICON: {
		width: 22,
		height: 22,
	},
};
