import { z } from "zod";

import { type Prisma, Role } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { baseDataTableQuerySchema } from "~/components/data-table/data-table-utils";
import {
	createTRPCRouter,
	publicProcedure,
	roleProtectedProcedure,
} from "~/server/api/trpc";
import schema from "~/server/db/json-schema.json";
import {
	getDataById,
	mobDefinitionToDatabaseMob,
} from "~/utils/fo-data/service";
import { getSlugFromName } from "~/utils/misc";
import { mobSchema } from "./schemas";
import { mobSearchFilterSchema } from "./search-params";

const requiredFields = schema.definitions.Mob.required;
const searchFields = ["name", "desc", "slug"];

export default createTRPCRouter({
	getAllPopulated: publicProcedure
		.input(mobSearchFilterSchema.and(baseDataTableQuerySchema))
		.query(async ({ ctx: { db }, input }) => {
			const { page, per_page, sort, sort_dir, query, maxLevel, minLevel } =
				input;

			const pageIndex = page - 1;

			const isSortFieldRequired = requiredFields.includes(sort);

			const conditions: Prisma.MobWhereInput[] = [];

			if (query) {
				conditions.push({
					OR: searchFields.map((f) => ({
						[f]: {
							contains: query,
						},
					})),
				});
			}

			if (typeof minLevel === "number") {
				conditions.push({
					level: {
						gte: minLevel,
					},
				});
			}

			if (typeof maxLevel === "number") {
				conditions.push({
					level: {
						lte: maxLevel,
					},
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

			const data = await db.mob.findMany({
				orderBy: {
					[sort]: isSortFieldRequired
						? sort_dir
						: { sort: sort_dir, nulls: "last" },
				},
				include: {
					drops: {
						include: {
							item: {
								select: {
									id: true,
									slug: true,
									spriteName: true,
									name: true,
									sellPrice: true,
									sellPriceUnit: true,
								},
							},
						},
						orderBy: {
							item: {
								sellPrice: "asc",
							},
						},
					},
					faction: true,
					locations: {
						select: {
							area: {
								select: {
									id: true,
									slug: true,
									name: true,
								},
							},
						},
					},
				},
				where,
				take: per_page,
				skip: pageIndex * per_page,
			});

			const totalCount = await db.mob.count({ where });

			return {
				data,
				totalCount,
				totalPages: Math.ceil(totalCount / per_page),
			};
		}),

	getAllQuick: publicProcedure.query(async ({ ctx: { db } }) => {
		return db.mob.findMany({
			orderBy: {
				name: "asc",
			},
			select: {
				id: true,
				name: true,
				spriteName: true,
			},
		});
	}),

	getById: publicProcedure
		.input(z.object({ id: z.string() }))
		.query(({ ctx: { db }, input: { id } }) => {
			return db.mob.findUniqueOrThrow({
				where: {
					id,
				},
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
			});
		}),

	getBySlug: publicProcedure
		.input(z.object({ slug: z.string() }))
		.query(({ ctx: { db }, input: { slug } }) => {
			return db.mob.findFirst({
				where: {
					slug,
				},
				include: {
					drops: {
						include: {
							item: {
								select: {
									id: true,
									slug: true,
									spriteName: true,
									name: true,
									sellPrice: true,
									sellPriceUnit: true,
								},
							},
						},
						orderBy: {
							item: {
								sellPrice: "asc",
							},
						},
					},
					faction: true,
					locations: {
						include: {
							area: {
								select: {
									id: true,
									slug: true,
									name: true,
								},
							},
						},
					},
				},
			});
		}),

	create: roleProtectedProcedure(Role.MODERATOR)
		.input(z.object({ data: mobSchema, inGameId: z.number() }))
		.mutation(async ({ ctx: { db }, input }) => {
			const { data, inGameId } = input;

			const { locations, ...rest } = data;

			const definitionData = await getDataById("mobs", inGameId);

			if (!definitionData) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: `Mob definition not found for id: ${inGameId}`,
				});
			}

			const { factionId, ...converted } =
				mobDefinitionToDatabaseMob(definitionData);

			return db.mob.create({
				data: {
					locations: locations && {
						createMany: {
							data: locations,
						},
					},
					faction: {
						connect: {
							inGameId: factionId,
						},
					},
					...rest,
					...converted,
				},
			});
		}),

	update: roleProtectedProcedure(Role.MODERATOR)
		.input(z.object({ id: z.string(), data: mobSchema }))
		.mutation(async ({ ctx: { db }, input }) => {
			const { id, data } = input;
			const { locations, ...fields } = data;

			let updated = await db.mob.update({
				where: {
					id,
				},
				data: {
					...fields,
					locations: locations && {
						upsert: locations.map((l) => ({
							create: l,
							update: l,
							where: {
								areaId_x_y_mobId: {
									areaId: l.areaId,
									x: l.x,
									y: l.y,
									mobId: id,
								},
							},
						})),
					},
				},
				include: {
					locations: true,
				},
			});

			const locationsToRemove = updated.locations.filter((updatedLocation) => {
				return !locations?.find((inputLocation) => {
					return (
						updatedLocation.areaId === inputLocation.areaId &&
						updatedLocation.x === inputLocation.x &&
						updatedLocation.y === inputLocation.y
					);
				});
			});

			if (locationsToRemove.length) {
				updated = await db.mob.update({
					where: {
						id,
					},
					data: {
						locations: {
							delete: locationsToRemove.map((l) => ({
								id: l.id,
							})),
						},
					},
					include: {
						locations: true,
					},
				});
			}

			return updated;
		}),

	syncDefinition: roleProtectedProcedure(Role.MODERATOR)
		.input(z.object({ inGameId: z.number() }))
		.mutation(async ({ ctx: { db }, input }) => {
			const { inGameId } = input;

			const definitionData = await getDataById("mobs", inGameId);

			if (!definitionData) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: `Item definition not found for id: ${inGameId}`,
				});
			}

			const { factionId, ...converted } =
				mobDefinitionToDatabaseMob(definitionData);

			return db.mob.update({
				data: {
					definitionUpdatedAt: new Date(),
					...converted,
					faction: {
						connect: {
							inGameId: factionId,
						},
					},
				},
				where: {
					inGameId,
				},
			});
		}),

	delete: roleProtectedProcedure(Role.ADMIN)
		.input(z.object({ id: z.string() }))
		.mutation(({ ctx: { db }, input: { id } }) => {
			return db.mob.delete({
				where: { id },
			});
		}),
});
