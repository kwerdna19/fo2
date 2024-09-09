import { z } from "zod";
import { locationsSchema } from "../areas/schemas";

export const dropsSchema = z
	.object({
		itemId: z.string(),
		dropRate: z.number().optional(),
	})
	.array();

export const mobSchema = z.object({
	boss: z.boolean().optional(),
	locations: locationsSchema.optional(),
});
