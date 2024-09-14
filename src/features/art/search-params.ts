import { createSearchParamsCache } from "nuqs/server";
import { z } from "zod";
import { dataTableSearchParams } from "~/components/data-table/data-table-utils";

export const artSearchParamParser = {};

export const artSearchParamCache = createSearchParamsCache({
	...artSearchParamParser,
	...dataTableSearchParams,
});

export const artSearchFilterSchema = z.object({});
