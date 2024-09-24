import { baseDataTableQuerySchema } from "~/components/data-table/data-table-utils";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { factionSearchFilterSchema } from "./search-params";

import type { Prisma } from "@prisma/client";
import schema from "~/server/db/json-schema.json";

const requiredFields = schema.definitions.Faction.required;
const searchFields = ["name", "slug"];

export default createTRPCRouter({
	getAllPopulated: publicProcedure
		.input(factionSearchFilterSchema.and(baseDataTableQuerySchema))
		.query(async ({ ctx: { db }, input }) => {
			const { page, per_page, sort, sort_dir, query } = input;

			const pageIndex = page - 1;

			const isSortFieldRequired = requiredFields.includes(sort);

			const conditions: Prisma.FactionWhereInput[] = [];

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

			const data = await db.faction.findMany({
				orderBy: {
					[sort]: isSortFieldRequired
						? sort_dir
						: { sort: sort_dir, nulls: "last" },
				},
				include: {
					_count: {
						select: {
							mobs: {
								where: {
									factionXp: {
										gt: 0,
									},
								},
							},
						},
					},
				},
				where,
				take: per_page,
				skip: pageIndex * per_page,
			});

			const totalCount = await db.faction.count({ where });

			return {
				data,
				totalCount,
				totalPages: Math.ceil(totalCount / per_page),
			};
		}),
	getAllQuick: publicProcedure.query(({ ctx: { db } }) => {
		return db.faction.findMany({
			select: {
				id: true,
				name: true,
			},
		});
	}),
});
