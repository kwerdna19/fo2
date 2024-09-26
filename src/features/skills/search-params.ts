import { createSearchParamsCache, parseAsInteger } from "nuqs/server";
import { z } from "zod";
import { getDataTableSearchParams } from "~/components/data-table/data-table-utils";
import { LEVEL_CAP } from "~/utils/fo-game";

export const skillSearchParamParser = {
	minLevel: parseAsInteger,
	maxLevel: parseAsInteger,
};

export const skillSearchParamCache = createSearchParamsCache({
	...skillSearchParamParser,
	...getDataTableSearchParams(),
});

export const skillSearchFilterSchema = z.object({
	minLevel: z.number().int().min(0).max(LEVEL_CAP).nullish(),
	maxLevel: z.number().int().min(0).max(LEVEL_CAP).nullish(),
});
