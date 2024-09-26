import { createSearchParamsCache } from "nuqs/server";
import { z } from "zod";
import { getDataTableSearchParams } from "~/components/data-table/data-table-utils";

export const artSearchParamParser = {};

export const artSearchParamCache = createSearchParamsCache({
	...artSearchParamParser,
	...getDataTableSearchParams(),
});

export const artSearchFilterSchema = z.object({});
