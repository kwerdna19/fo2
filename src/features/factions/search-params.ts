import { createSearchParamsCache, parseAsInteger } from "nuqs/server";
import { z } from "zod";
import { dataTableSearchParams } from "~/components/data-table/data-table-utils";

export const factionSearchParamParser = {};

export const factionSearchParamCache = createSearchParamsCache({
	...factionSearchParamParser,
	...dataTableSearchParams,
});

export const factionSearchFilterSchema = z.object({});
