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
							ingredients: {
								include: {
									item: true,
								},
							},
						},
					},
					area: {
						select: {
							id: true,
							name: true,
						},
					},
				},
			});
		}),

	create: roleProtectedProcedure(Role.MODERATOR)
		.input(npcSchema)
		.mutation(({ ctx: { db }, input }) => {
			const {
				name,
				items,
				locations,
				crafts,
				area: teleportArea,
				...rest
			} = input;

			return db.npc.create({
				data: {
					name,
					slug: getSlugFromName(name),
					locations: {
						createMany: {
							data: locations.map(({ coordinates, area }) => ({
								...coordinates,
								areaId: area.id,
							})),
						},
					},
					items: {
						createMany: {
							data: items.map(({ item, price, unit }) => ({
								itemId: item.id,
								price,
								unit,
							})),
						},
					},
					crafts: {
						create: crafts.map(({ item, ingredients, ...s }) => ({
							itemId: item.id,
							...s,
							ingredients: {
								create: ingredients.map((ingredient) => ({
									itemId: ingredient.item.id,
									quantity: ingredient.quantity,
								})),
							},
						})),
					},
					areaId: teleportArea?.id,
					...rest,
				},
			});
		}),

	update: roleProtectedProcedure(Role.MODERATOR)
		.input(z.object({ id: z.string(), data: npcSchema }))
		.mutation(async ({ ctx: { db }, input }) => {
			const { data, id } = input;
			const { items, locations, crafts, area: teleportArea, ...fields } = data;

			const updated = await db.npc.update({
				where: {
					id,
				},
				data: {
					...fields,
					slug: getSlugFromName(fields.name),
					updatedAt: new Date(),
					items: {
						deleteMany: {},
						createMany: {
							data: items.map(({ item, price, unit }) => ({
								itemId: item.id,
								price,
								unit,
							})),
						},
					},
					locations: {
						deleteMany: {},
						createMany: {
							data: locations.map(({ coordinates, area }) => ({
								...coordinates,
								areaId: area.id,
							})),
						},
					},
					crafts: {
						upsert: crafts.map(({ item, ingredients, ...d }) => ({
							create: {
								...d,
								itemId: item.id,
								ingredients: {
									connectOrCreate: ingredients.map((ingredient) => ({
										create: {
											itemId: ingredient.item.id,
											quantity: ingredient.quantity,
										},
										where: {
											itemId_quantity: {
												itemId: ingredient.item.id,
												quantity: ingredient.quantity,
											},
										},
									})),
								},
							},
							update: {
								...d,
								ingredients: {
									deleteMany: {},
									connectOrCreate: ingredients.map((ingredient) => ({
										create: {
											itemId: ingredient.item.id,
											quantity: ingredient.quantity,
										},
										where: {
											itemId_quantity: {
												itemId: ingredient.item.id,
												quantity: ingredient.quantity,
											},
										},
									})),
								},
							},
							where: {
								npcId_itemId: { npcId: id, itemId: item.id },
							},
						})),
					},
					areaId: teleportArea?.id ?? null,
				},
			});

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
