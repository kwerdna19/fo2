import { Unit } from "@prisma/client";
import { z } from "zod";

export const soldBySchema = z
	.object({
		id: z.number(),
		name: z.string(),
	})
	.array();

export const ingredientsSchema = z
	.object({
		item: z.object({
			id: z.number(),
			name: z.string(),
		}),
		quantity: z.number().int().default(1),
	})
	.array();

export const craftedBySchema = z
	.object({
		npc: z.object({
			id: z.number(),
			name: z.string(),
		}),
		durationMinutes: z.number(),
		unit: z.nativeEnum(Unit),
		price: z.number().int(),
		ingredients: ingredientsSchema,
	})
	.array();

export const itemSchema = z.object({
	note: z.string().nullish(),
	artist: z.string().nullish(),

	globalLoot: z.boolean().nullish(),
	globalLootDropRate: z.number().nullish(),

	// availableStart: z.date().optional(),
	// availableEnd: z.date().optional(),

	soldBy: soldBySchema,
	craftedBy: craftedBySchema,
	// battlePassTiers: itemBattlePassTiersSchema,
});
