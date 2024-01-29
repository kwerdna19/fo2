import { Unit } from "@prisma/client";
import { z } from "zod";

export const battlePassTierSchema = z.object({
	itemId: z.string().optional(),
	amount: z.number().int().optional(),
	unit: z.nativeEnum(Unit).optional(),
});

export const battlePassSchema = z.object({
	name: z.string(),
	tiers: battlePassTierSchema.array().optional(),
	desc: z.string().optional(),
	note: z.string().optional(),
	durationDays: z.number().min(1).optional(),
	xpPerTier: z.number().min(1).optional(),
});
