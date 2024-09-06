import { EquippableType } from "@prisma/client";
import {
	createSearchParamsCache,
	parseAsArrayOf,
	parseAsInteger,
	parseAsStringEnum,
} from "nuqs/server";
import { z } from "zod";
import { dataTableSearchParams } from "~/components/data-table/data-table-utils";
import { MAX_LEVEL } from "~/utils/fo-game";

const types = Object.values(EquippableType);

const equipTypeSchema = z.custom<EquippableType>((s) =>
	types.some((t) => t === s),
);

export const itemSearchParamParser = {
	minLevel: parseAsInteger,
	maxLevel: parseAsInteger,
	type: parseAsInteger,
	subType: parseAsInteger,
};

export const itemSearchParamCache = createSearchParamsCache({
	...itemSearchParamParser,
	...dataTableSearchParams,
});

export const itemSearchFilterSchema = z.object({
	minLevel: z.number().int().min(0).max(MAX_LEVEL).nullish(),
	maxLevel: z.number().int().min(0).max(MAX_LEVEL).nullish(),
	type: z.number().int().nullish(),
	subType: z.number().int().nullish(),
});
