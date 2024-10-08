import { parseAsInteger, parseAsString, parseAsStringEnum } from "nuqs/server";
import { z } from "zod";

export const pageSizeOptions = [10, 25, 50, 100] as const;

export const DEFAULT_PAGE_SIZE = pageSizeOptions[1];

export type DataTableSearchParamOptions = { defaultSort?: string } | undefined;

export const getDataTableSearchParams = (
	ops?: DataTableSearchParamOptions,
) => ({
	query: parseAsString,
	page: parseAsInteger.withDefault(1).withOptions({ clearOnDefault: true }),
	per_page: parseAsInteger
		.withDefault(DEFAULT_PAGE_SIZE)
		.withOptions({ clearOnDefault: true }),
	sort: parseAsString.withDefault(ops?.defaultSort ?? "id"),
	sort_dir: parseAsStringEnum(["asc", "desc"]).withDefault("asc"),
});

export const baseDataTableQuerySchema = z.object({
	query: z.string().nullish(),
	page: z.number().int().min(0).catch(0),
	per_page: z
		.number()
		.int()
		.refine((p) => pageSizeOptions.some((i) => i === p))
		.catch(DEFAULT_PAGE_SIZE),
	sort: z.string(),
	sort_dir: z.enum(["asc", "desc"]),
});
