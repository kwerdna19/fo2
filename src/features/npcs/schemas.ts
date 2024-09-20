import { Unit } from "@prisma/client";
import { z } from "zod";
import { locationsSchema } from "../areas/schemas";
import { ingredientsSchema } from "../items/schemas";

export const saleItemsSchema = z
	.object({
		item: z.object({
			id: z.string(),
			name: z.string(),
		}),
		price: z.number(),
		unit: z.nativeEnum(Unit).optional(),
	})
	.array();

export const craftItemsSchema = z
	.object({
		item: z.object({
			id: z.string(),
			name: z.string(),
		}),
		price: z.number().int(),
		durationMinutes: z.number(),
		unit: z.nativeEnum(Unit).optional(),
		ingredients: ingredientsSchema,
	})
	.array();

export const npcTypes = [
	"Storage",
	"Shop",
	"Quest",
	"Market",
	"Craft",
	"Teleport",
	"Service",
] as const;

export type NpcType = (typeof npcTypes)[number];

export const npcSchema = z.object({
	name: z.string(),
	note: z.string().nullish(),
	type: z.enum(npcTypes),
	spriteName: z.string(),
	locations: locationsSchema,
	items: saleItemsSchema,
	crafts: craftItemsSchema,
	area: z
		.object({
			id: z.string(),
			name: z.string(),
		})
		.nullish(),
});
