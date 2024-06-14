import { EquippableType, type Item, Unit } from "@prisma/client";
import {
	parseAsArrayOf,
	parseAsInteger,
	parseAsString,
	parseAsStringEnum,
} from "nuqs/server";
import { z } from "zod";
import { LEVEL_CAP } from "~/utils/fo";
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
	spriteUrl: z.string(),
	equip: z
		.string()
		.refine((arg) => !!EquippableType[arg as EquippableType])
		.optional(),
	levelReq: z.number().int().optional(),
	twoHand: z.boolean().optional(),
	consumable: z.boolean().optional(),
	sellPrice: z.number().int().optional(),
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

	droppedBy: droppedBySchema.optional(),
	soldBy: soldBySchema.optional(),
	craftedBy: craftedBySchema.optional(),
	battlePassTiers: itemBattlePassTiersSchema.optional(),
});

export const itemSearchParamParser = {
	query: parseAsString,
	page: parseAsInteger.withDefault(1),
	perPage: parseAsInteger.withDefault(10),
	minLevel: parseAsInteger,
	maxLevel: parseAsInteger,
	sort: parseAsString.withDefault("slug"),
	sortDirection: parseAsStringEnum(["asc", "desc"]).withDefault("asc"),
	equipTypes: parseAsArrayOf(parseAsString),
};

export const itemSorts = [
	{
		key: "slug",
		name: "Name",
	},
	{
		key: "sellPrice",
		name: "Sell Price",
	},
	{
		key: "dmgMax",
		name: "Max Damage",
	},
	{
		key: "dmgMin",
		name: "Min Damage",
	},
	{
		key: "range",
		name: "Range",
	},
	{
		key: "agi",
		name: "Bonus AGI",
	},
	{
		key: "str",
		name: "Bonus STR",
	},
	{
		key: "sta",
		name: "Bonus STA",
	},
	{
		key: "int",
		name: "Bonus INT",
	},
] satisfies { key: keyof Item; name: string }[];

export const itemSearchFilterSchema = z.object({
	query: z.string().nullish(),
	page: z.number().int().min(1).default(1),
	perPage: z.number().int().min(10).max(100).default(10),
	minLevel: z.number().int().min(0).nullish(),
	maxLevel: z
		.number()
		.int()
		.max(LEVEL_CAP * 2)
		.nullish(),
	sort: z.string(),
	sortDirection: z.enum(["asc", "desc"]),
	equipTypes: z.string().array().nullish(),
});
