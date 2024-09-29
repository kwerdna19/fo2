import { z } from "zod";

import type { Prisma } from "@prisma/client";
import { baseDataTableQuerySchema } from "~/components/data-table/data-table-utils";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { areaSearchFilterSchema } from "./search-params";

import schema from "~/server/db/json-schema.json";

const requiredFields = schema.definitions.Area.required;
const searchFields = ["name"];

export default createTRPCRouter({
	getAllQuick: publicProcedure
		.input(z.string().optional())
		.query(({ ctx: { db }, input }) => {
			return db.area.findMany({
				orderBy: {
					createdAt: "asc",
				},
				select: {
					id: true,
					name: true,
					// slug: true,
					// spriteUrl: true,
					// width: true,
					// height: true,
					// note: true,
				},
				where: input
					? {
							name: {
								contains: input,
							},
						}
					: undefined,
			});
		}),

	getAllPopulated: publicProcedure
		.input(areaSearchFilterSchema.and(baseDataTableQuerySchema))
		.query(async ({ ctx: { db }, input }) => {
			const { page, per_page, sort, sort_dir, query } = input;

			const pageIndex = page - 1;

			const isSortFieldRequired = requiredFields.includes(sort);

			const conditions: Prisma.AreaWhereInput[] = [];

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

			const data = await db.area.findMany({
				orderBy: {
					[sort]: isSortFieldRequired
						? sort_dir
						: { sort: sort_dir, nulls: "last" },
				},
				include: {
					locations: {
						include: {
							mob: {
								include: {
									drops: {
										include: {
											item: true,
										},
										orderBy: {
											item: {
												sellPrice: "asc",
											},
										},
									},
								},
							},
							npc: true,
						},
					},
				},
				where,
				take: per_page,
				skip: pageIndex * per_page,
			});

			const totalCount = await db.area.count({ where });

			return {
				data,
				totalCount,
				totalPages: Math.ceil(totalCount / per_page),
			};
		}),

	getById: publicProcedure
		.input(z.number())
		.query(({ ctx: { db }, input: id }) => {
			return db.area.findUniqueOrThrow({
				where: { id },
				include: {
					locations: {
						include: {
							mob: {
								include: {
									drops: {
										include: {
											item: true,
										},
										orderBy: {
											item: {
												sellPrice: "asc",
											},
										},
									},
								},
							},
							npc: {
								include: {
									selling: true,
								},
							},
						},
					},
				},
			});
		}),

	getAll: publicProcedure.query(({ ctx: { db } }) => {
		return db.area.findMany();
	}),
});
