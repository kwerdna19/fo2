import { createSearchParamsCache, parseAsInteger } from "nuqs/server";
import { z } from "zod";
import { getDataTableSearchParams } from "~/components/data-table/data-table-utils";

export const collectionSearchParamParser = {
	type: parseAsInteger,
	subType: parseAsInteger,
};

export const collectionSearchParamCache = createSearchParamsCache({
	...collectionSearchParamParser,
	...getDataTableSearchParams({ defaultSort: "addedAt" }),
});

export const collectionSearchFilterSchema = z.object({
	type: z.number().int().nullish(),
	subType: z.number().int().nullish(),
});
