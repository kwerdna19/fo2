import { z } from "zod";

import { type Prisma, Role } from "@prisma/client";
import { baseDataTableQuerySchema } from "~/components/data-table/data-table-utils";
import {
	createTRPCRouter,
	publicProcedure,
	roleProtectedProcedure,
} from "~/server/api/trpc";
import schema from "~/server/db/json-schema.json";
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
							item: true,
						},
						orderBy: {
							dropRate: "desc",
						},
					},
					locations: true,
				},
			});
		}),

	create: roleProtectedProcedure(Role.MODERATOR)
		.input(mobSchema)
		.mutation(({ ctx: { db }, input }) => {
			const { name, drops, locations, ...rest } = input;

			return db.mob.create({
				data: {
					name,
					slug: getSlugFromName(name),
					locations: locations && {
						createMany: {
							data: locations,
						},
					},
					drops: drops && {
						createMany: {
							data: drops,
						},
					},
					...rest,
				},
			});
		}),

	update: roleProtectedProcedure(Role.MODERATOR)
		.input(z.object({ id: z.string(), data: mobSchema }))
		.mutation(async ({ ctx: { db }, input }) => {
			const { id, data } = input;
			const { drops, locations, ...fields } = data;

			let updated = await db.mob.update({
				where: {
					id,
				},
				data: {
					...fields,
					slug: getSlugFromName(fields.name),
					updatedAt: new Date(),
					drops: drops && {
						upsert: drops.map(({ itemId, dropRate }) => ({
							create: {
								dropRate,
								itemId,
							},
							update: {
								dropRate,
							},
							where: {
								mobId_itemId: {
									itemId,
									mobId: id,
								},
							},
						})),
					},
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
					drops: true,
					locations: true,
				},
			});

			const itemsToRemove = updated.drops.filter((updatedItem) => {
				return !drops?.find((inputItem) => {
					return (
						inputItem.itemId === updatedItem.itemId &&
						inputItem.dropRate === updatedItem.dropRate
					);
				});
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

			if (itemsToRemove.length || locationsToRemove.length) {
				updated = await db.mob.update({
					where: {
						id,
					},
					data: {
						drops: {
							delete: itemsToRemove.map((item) => ({
								mobId_itemId: {
									mobId: id,
									itemId: item.itemId,
								},
							})),
						},
						locations: {
							delete: locationsToRemove.map((l) => ({
								id: l.id,
							})),
						},
					},
					include: {
						drops: true,
						locations: true,
					},
				});
			}

			return updated;
		}),

	delete: roleProtectedProcedure(Role.ADMIN)
		.input(z.object({ id: z.string() }))
		.mutation(({ ctx: { db }, input: { id } }) => {
			return db.mob.delete({
				where: { id },
			});
		}),
});
