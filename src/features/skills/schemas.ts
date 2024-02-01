import { z } from "zod";

export const skillItemsSchema = z
	.object({
		id: z.string(),
	})
	.array();

export const skillSchema = z.object({
	name: z.string(),
	rank: z.number().int(),
	desc: z.string().optional(),
	note: z.string().optional(),
	spriteUrl: z.string(),
	type: z.string().optional(),
	levelReq: z.number().int().optional(),

	reqStr: z.number().int().optional(),
	reqSta: z.number().int().optional(),
	reqAgi: z.number().int().optional(),
	reqInt: z.number().int().optional(),

	range: z.number().int().optional(),
	atkPower: z.number().int().optional(),
	str: z.number().int().optional(),
	sta: z.number().int().optional(),
	agi: z.number().int().optional(),
	int: z.number().int().optional(),
	armor: z.number().int().optional(),
	atkSpeed: z.number().optional(),
	minValue: z.number().int().optional(),
	maxValue: z.number().int().optional(),
	value: z.number().int().optional(),
	tickDurationSec: z.number().optional(),

	castTimeSec: z.number().optional(),
	durationMins: z.number().optional(),
	energyCost: z.number().int().optional(),

	areaId: z.string().optional(),
	items: skillItemsSchema.optional(),
});
