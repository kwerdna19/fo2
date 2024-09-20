import { z } from "zod";

export const nameSchema = z.string().describe("Name");

export const selectedAreaSchema = z.object({
	name: z.string(),
	id: z.string(),
	spriteUrl: z.string(),
	width: z.number(),
	height: z.number(),
});

export const coordinatesSchema = z.object({
	x: z.number().int(),
	y: z.number().int(),
});

export const locationsSchema = z
	.object({
		coordinates: z.object({
			x: z.number().int(),
			y: z.number().int(),
		}),
		area: z.object({
			id: z.string(),
			name: z.string(),
		}),
	})
	.array();
