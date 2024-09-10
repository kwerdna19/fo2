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
import { npcSchema } from "./schemas";
import { npcSearchFilterSchema } from "./search-params";

const requiredFields = schema.definitions.Npc.required;
const searchFields = ["name", "slug"];

export default createTRPCRouter({
	getAllPopulated: publicProcedure
		.input(npcSearchFilterSchema.and(baseDataTableQuerySchema))
		.query(async ({ ctx: { db }, input }) => {
			const { page, per_page, sort, sort_dir, query } = input;

			const pageIndex = page - 1;

			const isSortFieldRequired = requiredFields.includes(sort);

			const conditions: Prisma.NpcWhereInput[] = [];

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

			const data = await db.npc.findMany({
				orderBy: {
					[sort]: isSortFieldRequired
						? sort_dir
						: { sort: sort_dir, nulls: "last" },
				},
				include: {
					items: {
						include: {
							item: true,
						},
						orderBy: [
							{
								unit: "desc",
							},
							{
								price: "asc",
							},
						],
					},
					locations: {
						include: {
							area: true,
						},
					},
					crafts: {
						include: {
							item: true,
						},
						orderBy: [
							{
								unit: "desc",
							},
							{
								price: "asc",
							},
						],
					},
				},
				where,
				take: per_page,
				skip: pageIndex * per_page,
			});

			const totalCount = await db.npc.count({ where });

			return {
				data,
				totalCount,
				totalPages: Math.ceil(totalCount / per_page),
			};
		}),

	getAllQuick: publicProcedure
		.input(z.string().optional())
		.query(async ({ ctx: { db }, input }) => {
			return db.npc.findMany({
				where: input
					? {
							OR: [
								{
									name: {
										contains: input,
									},
								},
								{
									slug: {
										contains: input,
									},
								},
							],
						}
					: {},
				orderBy: {
					name: "asc",
				},
				select: {
					id: true,
					name: true,
					// spriteUrl: true,
				},
			});
		}),

	getBySlug: publicProcedure
		.input(z.object({ slug: z.string() }))
		.query(({ ctx: { db }, input: { slug } }) => {
			return db.npc.findUnique({
				where: {
					slug,
				},
				include: {
					items: {
						include: {
							item: true,
						},
					},
					locations: {
						include: {
							area: true,
						},
					},
					crafts: {
						include: {
							item: true,
						},
					},
				},
			});
		}),

	create: roleProtectedProcedure(Role.MODERATOR)
		.input(npcSchema)
		.mutation(({ ctx: { db }, input }) => {
			const { name, items, locations, crafts, ...rest } = input;

			return db.npc.create({
				data: {
					name,
					slug: getSlugFromName(name),
					locations: locations && {
						createMany: {
							data: locations,
						},
					},
					items: items && {
						createMany: {
							data: items,
						},
					},
					crafts: crafts && {
						createMany: {
							data: crafts,
						},
					},
					...rest,
				},
			});
		}),

	update: roleProtectedProcedure(Role.MODERATOR)
		.input(z.object({ id: z.string(), data: npcSchema }))
		.mutation(async ({ ctx: { db }, input }) => {
			const { data, id } = input;
			const { items, locations, crafts, ...fields } = data;

			let updated = await db.npc.update({
				where: {
					id,
				},
				data: {
					...fields,
					slug: getSlugFromName(fields.name),
					updatedAt: new Date(),
					items: items && {
						upsert: items.map((d) => ({
							create: d,
							update: d,
							where: {
								npcId_itemId: {
									itemId: d.itemId,
									npcId: id,
								},
							},
						})),
					},
					locations: locations && {
						upsert: locations.map((l) => ({
							create: l,
							update: l,
							where: {
								areaId_x_y_npcId: {
									...l,
									npcId: id,
								},
							},
						})),
					},
					crafts: crafts && {
						upsert: crafts.map(({ ingredients, ...c }) => ({
							create: c,
							update: c,
							where: {
								npcId_itemId: {
									npcId: id,
									itemId: c.itemId,
								},
							},
						})),
					},
				},
				include: {
					items: true,
					locations: true,
					crafts: true,
				},
			});

			const itemsToRemove = updated.items.filter((updatedItem) => {
				return !items?.find((inputItem) => {
					return (
						inputItem.itemId === updatedItem.itemId &&
						inputItem.price === updatedItem.price &&
						inputItem.unit === updatedItem.unit
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

			const craftsToRemove = updated.crafts.filter((updatedCraft) => {
				return !crafts?.find((inputCraft) => {
					return (
						updatedCraft.durationMinutes === inputCraft.durationMinutes &&
						updatedCraft.itemId === inputCraft.itemId &&
						updatedCraft.price === inputCraft.price &&
						updatedCraft.unit === inputCraft.unit
					);
				});
			});

			if (
				itemsToRemove.length ||
				locationsToRemove.length ||
				craftsToRemove.length
			) {
				updated = await db.npc.update({
					where: {
						id,
					},
					data: {
						items: {
							delete: itemsToRemove.map((item) => ({
								npcId_itemId: {
									npcId: id,
									itemId: item.itemId,
								},
							})),
						},
						locations: {
							delete: locationsToRemove.map((l) => ({
								id: l.id,
							})),
						},
						crafts: {
							delete: craftsToRemove.map((c) => ({
								npcId_itemId: {
									npcId: id,
									itemId: c.itemId,
								},
							})),
						},
					},
					include: {
						items: true,
						locations: true,
						crafts: true,
					},
				});
			}

			return updated;
		}),

	delete: roleProtectedProcedure(Role.ADMIN)
		.input(z.object({ id: z.string() }))
		.mutation(({ ctx: { db }, input: { id } }) => {
			return db.npc.delete({
				where: { id },
			});
		}),
});
