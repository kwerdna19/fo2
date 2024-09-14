import type { Prisma } from "@prisma/client";
import { baseDataTableQuerySchema } from "~/components/data-table/data-table-utils";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import schema from "~/server/db/json-schema.json";
import { artSearchFilterSchema } from "./search-params";

const requiredFields = schema.definitions.Art.required;
const searchFields = ["name", "desc"];

export default createTRPCRouter({
	getAllPopulated: publicProcedure
		.input(artSearchFilterSchema.and(baseDataTableQuerySchema))
		.query(async ({ ctx: { db }, input }) => {
			const { page, per_page, sort, sort_dir, query } = input;

			const pageIndex = page - 1;

			const conditions: Prisma.ArtWhereInput[] = [];

			if (query) {
				conditions.push({
					OR: searchFields.map((f) => ({
						[f]: {
							contains: query,
						},
					})),
				});
			}

			const where =
				conditions.length === 1
					? conditions[0]
					: conditions.length > 1
						? {
								AND: conditions,
							}
						: {};

			const isSortFieldRequired = requiredFields.includes(sort);

			const data = await db.art.findMany({
				where: where,
				orderBy: {
					[sort]: isSortFieldRequired
						? sort_dir
						: { sort: sort_dir, nulls: "last" },
				},
				take: per_page,
				skip: pageIndex * per_page,
			});

			const totalCount = await db.art.count({
				where,
			});

			return {
				data,
				totalCount,
				totalPages: Math.ceil(totalCount / per_page),
			};
		}),
});
