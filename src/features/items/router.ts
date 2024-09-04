import { z } from "zod";

import { type EquippableType, type Prisma, Role } from "@prisma/client";
import { baseDataTableQuerySchema } from "~/components/data-table/data-table-utils";
import {
	createTRPCRouter,
	publicProcedure,
	roleProtectedProcedure,
} from "~/server/api/trpc";
import schema from "~/server/db/json-schema.json";
import { equipmentSlotConfig } from "~/utils/fo-game";
import { getSlugFromName } from "~/utils/misc";
import { itemSchema } from "./schemas";
import { itemSearchFilterSchema } from "./search-params";

const requiredFields = schema.definitions.Item.required;
const searchFields = ["name", "desc", "slug"];

export default createTRPCRouter({
	getAllPopulated: publicProcedure
		.input(itemSearchFilterSchema.and(baseDataTableQuerySchema))
		.query(async ({ ctx: { db }, input }) => {
			const {
				page,
				per_page,
				sort,
				sort_dir,
				query,
				maxLevel,
				minLevel,
				equipTypes,
			} = input;

			const isSortFieldRequired = requiredFields.includes(sort);

			const pageIndex = page - 1;

			const conditions: Prisma.ItemWhereInput[] = [];

			if (query) {
				conditions.push({
					OR: searchFields.map((f) => ({
						[f]: {
							contains: query,
						},
					})),
				});
			}

			if (equipTypes) {
				conditions.push({
					equip: {
						in: equipTypes as EquippableType[],
					},
				});
			}

			if (typeof minLevel === "number") {
				conditions.push({
					levelReq: {
						gte: minLevel,
					},
				});
			}

			if (typeof maxLevel === "number") {
				conditions.push({
					levelReq: {
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

			const data = await db.item.findMany({
				orderBy: {
					[sort]: isSortFieldRequired
						? sort_dir
						: { sort: sort_dir, nulls: "last" },
				},
				include: {
					droppedBy: {
						include: {
							mob: true,
						},
						orderBy: {
							mob: {
								level: "asc",
							},
						},
					},
					soldBy: {
						include: {
							npc: true,
						},
						orderBy: {
							price: "asc",
						},
					},
					craftedBy: {
						include: {
							npc: {
								select: {
									name: true,
									spriteUrl: true,
									slug: true,
								},
							},
						},
					},
				},
				where,
				take: per_page,
				skip: pageIndex * per_page,
			});

			const totalCount = await db.item.count({ where });

			return {
				data,
				totalCount,
				totalPages: Math.ceil(totalCount / per_page),
			};
		}),

	getAllEquipment: publicProcedure.query(async ({ ctx: { db } }) => {
		return db.item.findMany({
			orderBy: {
				slug: "asc",
			},
			where: {
				equip: {
					in: Object.keys(equipmentSlotConfig) as EquippableType[],
				},
			},
		});
	}),

	getAllQuick: publicProcedure.query(async ({ ctx: { db } }) => {
		return db.item.findMany({
			orderBy: {
				slug: "asc",
			},
			select: {
				id: true,
				name: true,
				spriteUrl: true,
				slug: true,
			},
		});
	}),

	getById: publicProcedure
		.input(z.object({ id: z.string() }))
		.query(({ ctx: { db }, input: { id } }) => {
			return db.item.findUniqueOrThrow({
				where: {
					id,
				},
				include: {
					droppedBy: {
						include: {
							mob: true,
						},
						orderBy: {
							mob: {
								level: "asc",
							},
						},
					},
				},
			});
		}),

	getBySlug: publicProcedure
		.input(z.object({ slug: z.string() }))
		.query(({ ctx: { db }, input: { slug } }) => {
			return db.item.findFirst({
				where: {
					slug,
				},
				include: {
					droppedBy: {
						include: {
							mob: true,
						},
						orderBy: {
							dropRate: "desc",
						},
					},
					soldBy: {
						include: {
							npc: true,
						},
					},
					craftedBy: {
						include: {
							npc: true,
						},
						orderBy: {
							durationMinutes: "asc",
						},
					},
				},
			});
		}),

	create: roleProtectedProcedure(Role.MODERATOR)
		.input(itemSchema)
		.mutation(({ ctx: { db }, input }) => {
			const {
				name,
				droppedBy,
				equip,
				soldBy,
				craftedBy,
				battlePassTiers,
				...rest
			} = input;

			return db.item.create({
				data: {
					name,
					equip: equip as EquippableType,
					slug: getSlugFromName(name),
					droppedBy: droppedBy && {
						createMany: {
							data: droppedBy,
						},
					},
					soldBy: soldBy && {
						createMany: {
							data: soldBy,
						},
					},
					craftedBy: craftedBy && {
						createMany: {
							data: craftedBy,
						},
					},
					battlePassTiers: battlePassTiers && {
						createMany: {
							data: battlePassTiers,
						},
					},
					...rest,
				},
			});
		}),

	update: roleProtectedProcedure(Role.MODERATOR)
		.input(z.object({ id: z.string(), data: itemSchema }))
		.mutation(async ({ ctx: { db }, input }) => {
			const { id, data } = input;
			const {
				name,
				droppedBy,
				equip,
				soldBy,
				craftedBy,
				battlePassTiers,
				...rest
			} = data;

			let updated = await db.item.update({
				where: {
					id,
				},
				data: {
					name,
					equip: equip as EquippableType,
					slug: getSlugFromName(name),
					updatedAt: new Date(),
					...rest,
					droppedBy: droppedBy && {
						upsert: droppedBy.map((d) => ({
							create: d,
							update: d,
							where: {
								mobId_itemId: {
									mobId: d.mobId,
									itemId: id,
								},
							},
						})),
					},
					soldBy: soldBy && {
						upsert: soldBy.map((d) => ({
							create: d,
							update: d,
							where: {
								npcId_itemId: {
									npcId: d.npcId,
									itemId: id,
								},
							},
						})),
					},
					craftedBy: craftedBy && {
						upsert: craftedBy.map((d) => ({
							create: d,
							update: d,
							where: {
								npcId_itemId: {
									npcId: d.npcId,
									itemId: id,
								},
							},
						})),
					},
					battlePassTiers: battlePassTiers && {
						upsert: battlePassTiers.map((p) => ({
							create: p,
							update: p,
							where: {
								battlePassId_tier: p,
								itemId: id,
							},
						})),
					},
				},
				include: {
					droppedBy: true,
					soldBy: true,
					craftedBy: true,
					battlePassTiers: true,
				},
			});

			const dropsToRemove = updated.droppedBy.filter((updatedDrop) => {
				return !droppedBy?.find((inputDrop) => {
					return (
						inputDrop.mobId === updatedDrop.mobId &&
						inputDrop.dropRate === updatedDrop.dropRate
					);
				});
			});

			const salesToRemove = updated.soldBy.filter((updatedSale) => {
				return !soldBy?.find((inputSale) => {
					return (
						inputSale.npcId === updatedSale.npcId &&
						inputSale.price === updatedSale.price &&
						inputSale.unit === updatedSale.unit
					);
				});
			});

			const craftsToRemove = updated.craftedBy.filter((updatedCraft) => {
				return !craftedBy?.find((inputCraft) => {
					return (
						inputCraft.npcId === updatedCraft.npcId &&
						inputCraft.price === updatedCraft.price &&
						inputCraft.unit === updatedCraft.unit &&
						inputCraft.durationMinutes === updatedCraft.durationMinutes
					);
				});
			});

			const tiersToRemove = updated.battlePassTiers.filter((updatedTier) => {
				return !battlePassTiers?.find((inputTier) => {
					return (
						inputTier.battlePassId === updatedTier.battlePassId &&
						inputTier.tier === updatedTier.tier
					);
				});
			});

			if (
				dropsToRemove.length ||
				salesToRemove.length ||
				craftsToRemove.length ||
				tiersToRemove.length
			) {
				updated = await db.item.update({
					where: {
						id,
					},
					data: {
						droppedBy: {
							delete: dropsToRemove.map((item) => ({
								mobId_itemId: {
									mobId: item.mobId,
									itemId: id,
								},
							})),
						},
						soldBy: {
							delete: salesToRemove.map((s) => ({
								npcId_itemId: {
									npcId: s.npcId,
									itemId: id,
								},
							})),
						},
						craftedBy: {
							delete: craftsToRemove.map((s) => ({
								npcId_itemId: {
									npcId: s.npcId,
									itemId: id,
								},
							})),
						},
						battlePassTiers: {
							delete: tiersToRemove.map((t) => ({
								battlePassId_tier: {
									battlePassId: t.battlePassId,
									tier: t.tier,
								},
								itemId: id,
							})),
						},
					},
					include: {
						droppedBy: true,
						soldBy: true,
						craftedBy: true,
						battlePassTiers: true,
					},
				});
			}

			return updated;
		}),

	delete: roleProtectedProcedure(Role.ADMIN)
		.input(z.object({ id: z.string() }))
		.mutation(({ ctx: { db }, input: { id } }) => {
			return db.item.delete({
				where: { id },
			});
		}),
});
