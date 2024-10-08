import {
	createSearchParamsCache,
	parseAsBoolean,
	parseAsInteger,
} from "nuqs/server";
import { z } from "zod";
import { getDataTableSearchParams } from "~/components/data-table/data-table-utils";
import { MAX_LEVEL } from "~/utils/fo-game";

export const itemSearchParamParser = {
	minLevel: parseAsInteger,
	maxLevel: parseAsInteger,
	type: parseAsInteger,
	subType: parseAsInteger,
	collectible: parseAsBoolean,
};

export const itemSearchParamCache = createSearchParamsCache({
	...itemSearchParamParser,
	...getDataTableSearchParams(),
});

export const itemSearchFilterSchema = z.object({
	minLevel: z.number().int().min(0).max(MAX_LEVEL).nullish(),
	maxLevel: z.number().int().min(0).max(MAX_LEVEL).nullish(),
	type: z.number().int().nullish(),
	subType: z.number().int().nullish(),
	collectible: z.boolean().nullish(),
});
