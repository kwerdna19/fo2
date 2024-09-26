import { createSearchParamsCache } from "nuqs/server";
import { z } from "zod";
import { getDataTableSearchParams } from "~/components/data-table/data-table-utils";

export const factionSearchParamParser = {};

export const factionSearchParamCache = createSearchParamsCache({
	...factionSearchParamParser,
	...getDataTableSearchParams({ defaultSort: "id" }),
});

export const factionSearchFilterSchema = z.object({});
