import { EquippableType, Unit } from "@prisma/client";
import { z } from "zod";
import { itemBattlePassTiersSchema } from "../battlepasses/schemas";

export const droppedBySchema = z
	.object({
		mobId: z.string(),
		dropRate: z.number().optional(),
	})
	.array();

export const soldBySchema = z
	.object({
		npcId: z.string(),
		unit: z.nativeEnum(Unit).optional(),
		price: z.number().int(),
	})
	.array();

export const craftedBySchema = z
	.object({
		npcId: z.string(),
		durationMinutes: z.number(),
		unit: z.nativeEnum(Unit).optional(),
		price: z.number().int(),
	})
	.array();

export const itemSchema = z.object({
	name: z.string(),
	desc: z.string().optional(),
	note: z.string().optional(),
	artist: z.string().optional(),
	equip: z
		.string()
		.refine((arg) => !!EquippableType[arg as EquippableType])
		.optional(),
	levelReq: z.number().int().optional(),
	twoHand: z.boolean().optional(),
	consumable: z.boolean().optional(),
	sellPrice: z.number().int(),
	sellPriceUnit: z.nativeEnum(Unit),

	buyPrice: z.number().int(),
	buyPriceUnit: z.nativeEnum(Unit),

	stackSize: z.number().int(),

	globalLoot: z.boolean().optional(),

	availableStart: z.date().optional(),
	availableEnd: z.date().optional(),

	reqStr: z.number().int().optional(),
	reqSta: z.number().int().optional(),
	reqAgi: z.number().int().optional(),
	reqInt: z.number().int().optional(),
	range: z.number().int().optional(),

	str: z.number().int().optional(),
	sta: z.number().int().optional(),
	agi: z.number().int().optional(),
	int: z.number().int().optional(),
	armor: z.number().int().optional(),

	atkSpeed: z.number().optional(),
	dmgMin: z.number().int().optional(),
	dmgMax: z.number().int().optional(),

	inGameId: z.number().int(),
	// spriteName: z.string(),
	type: z.number().int(),
	subType: z.number().int(),

	droppedBy: droppedBySchema.optional(),
	soldBy: soldBySchema.optional(),
	craftedBy: craftedBySchema.optional(),
	battlePassTiers: itemBattlePassTiersSchema.optional(),
});
