import { z } from "zod";
import { locationsSchema } from "../areas/schemas";

export const dropsSchema = z
	.object({
		itemId: z.string(),
		dropRate: z.number().optional(),
	})
	.array();

export const mobSchema = z.object({
	name: z.string(),
	spriteUrl: z.string(),
	level: z.number().int(),
	health: z.number().int(),
	goldMin: z.number(),
	goldMax: z.number(),
	boss: z.boolean().optional(),
	atkSpeed: z.number().optional(),
	dmgMin: z.number().optional(),
	dmgMax: z.number().optional(),
	locations: locationsSchema.optional(),
	drops: dropsSchema.optional(),
});
