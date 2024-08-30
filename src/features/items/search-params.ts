import { EquippableType } from "@prisma/client";
import {
	createSearchParamsCache,
	parseAsArrayOf,
	parseAsInteger,
	parseAsStringEnum,
} from "nuqs/server";
import { z } from "zod";
import { dataTableSearchParams } from "~/components/data-table/data-table-utils";
import { LEVEL_CAP } from "~/utils/fo";

const types = Object.values(EquippableType);

const equipTypeSchema = z.custom<EquippableType>((s) =>
	types.some((t) => t === s),
);

export const itemSearchParamParser = {
	minLevel: parseAsInteger,
	maxLevel: parseAsInteger,
	equipTypes: parseAsArrayOf(parseAsStringEnum(types)),
};

export const itemSearchParamCache = createSearchParamsCache({
	...itemSearchParamParser,
	...dataTableSearchParams,
});

export const itemSearchFilterSchema = z.object({
	minLevel: z.number().int().min(0).max(LEVEL_CAP).nullish(),
	maxLevel: z.number().int().min(0).max(LEVEL_CAP).nullish(),
	equipTypes: z.array(equipTypeSchema).nullish(),
});
