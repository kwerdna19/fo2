import { createSearchParamsCache } from "nuqs/server";
import { z } from "zod";
import { getDataTableSearchParams } from "~/components/data-table/data-table-utils";

export const areaSearchParamParser = {};

export const areaSearchParamCache = createSearchParamsCache({
	...areaSearchParamParser,
	...getDataTableSearchParams({ defaultSort: "id" }),
});

export const areaSearchFilterSchema = z.object({});
