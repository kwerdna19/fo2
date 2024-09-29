import { Unit } from "@prisma/client";
import { z } from "zod";

export const battlePassTierSchema = z.object({
	item: z
		.object({
			id: z.number(),
			name: z.string(),
		})
		.nullish(),
	amount: z.number().int().optional(),
	unit: z.nativeEnum(Unit).optional(),
});

export const itemBattlePassTiersSchema = z
	.object({
		battlePassId: z.string(),
		tier: z.number().int(),
	})
	.array();

export const battlePassSchema = z.object({
	item: z.object({
		id: z.number(),
		name: z.string(),
	}),
	tiers: battlePassTierSchema.array(),
	desc: z.string().optional(),
	note: z.string().optional(),
	durationDays: z.number().min(1).optional(),
	xpPerTier: z.number().min(1).optional(),
});
