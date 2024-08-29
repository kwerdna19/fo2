import {
	parseAsArrayOf,
	parseAsInteger,
	parseAsString,
	parseAsStringEnum,
} from "nuqs";
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
	factionXp: z.number().int().optional(),
	factionId: z.string().optional(),
});

export const mobSearchFilterSchema = z.object({
	query: z.string().nullish(),
	pageIndex: z.number().int().min(0).default(0),
	pageSize: z.number().int().min(10).max(100).default(10),
	// minLevel: z.number().int().min(0).nullish(),
	// maxLevel: z.number().int().min(0).nullish(),
	sort: z.string(),
	sortDirection: z.enum(["asc", "desc"]),
});

export const paginationSearchParams = {
	page: parseAsInteger.withDefault(1).withOptions({ clearOnDefault: true }),
	per_page: parseAsInteger
		.withDefault(20)
		.withOptions({ clearOnDefault: true }),
};

export const mobSearchParamParser = {
	query: parseAsString,
	...paginationSearchParams,
	minLevel: parseAsInteger,
	maxLevel: parseAsInteger,
	sort: parseAsString.withDefault("level"),
	sort_dir: parseAsStringEnum(["asc", "desc"]).withDefault("asc"),
};
