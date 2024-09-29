import { z } from "zod";

export const skillItemsSchema = z
	.object({
		id: z.number(),
		name: z.string(),
	})
	.array();

export const skillSchema = z.object({
	name: z.string(),
	rank: z.number().int(),
	desc: z.string().nullish(),
	note: z.string().nullish(),
	spriteName: z.string(),

	type: z.string(),
	levelReq: z.number().int().optional(),

	reqStr: z.number().int().nullish(),
	reqSta: z.number().int().nullish(),
	reqAgi: z.number().int().nullish(),
	reqInt: z.number().int().nullish(),

	range: z.number().int().nullish(),
	atkPower: z.number().int().nullish(),
	str: z.number().int().nullish(),
	sta: z.number().int().nullish(),
	agi: z.number().int().nullish(),
	int: z.number().int().nullish(),
	armor: z.number().int().nullish(),
	crit: z.number().nullish(),
	dodge: z.number().nullish(),

	atkSpeed: z.number().nullish(),
	minValue: z.number().int().nullish(),
	maxValue: z.number().int().nullish(),
	value: z.number().int().nullish(),
	tickDurationSec: z.number().nullish(),
	castCooldownTimeSec: z.number().nullish(),

	castTimeSec: z.number().nullish(),
	durationMins: z.number().nullish(),
	energyCost: z.number().int().nullish(),

	area: z
		.object({
			id: z.number(),
			name: z.string(),
		})
		.nullish(),
	items: skillItemsSchema,
});
