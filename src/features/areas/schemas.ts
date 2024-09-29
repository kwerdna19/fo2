import { z } from "zod";

export const coordinatesSchema = z.object({
	x: z.number().int(),
	y: z.number().int(),
});

export const locationsSchema = z
	.object({
		coordinates: coordinatesSchema,
		area: z.object({
			id: z.number(),
			name: z.string(),
		}),
	})
	.array();

export const areaSchema = z.object({
	name: z.string(),
	id: z.string(),
	spriteUrl: z.string(),
	width: z.number(),
	height: z.number(),
});
