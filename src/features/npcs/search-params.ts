import { createSearchParamsCache, parseAsInteger } from "nuqs/server";
import { z } from "zod";
import { dataTableSearchParams } from "~/components/data-table/data-table-utils";
import { LEVEL_CAP } from "~/utils/fo-game";

export const npcSearchParamParser = {
	// minLevel: parseAsInteger,
	// maxLevel: parseAsInteger,
};

export const npcSearchParamCache = createSearchParamsCache({
	...npcSearchParamParser,
	...dataTableSearchParams,
});

export const npcSearchFilterSchema = z.object({
	// minLevel: z.number().int().min(0).max(LEVEL_CAP).nullish(),
	// maxLevel: z.number().int().min(0).max(LEVEL_CAP).nullish(),
});
