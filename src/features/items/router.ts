import { z } from "zod";

import { get } from "http";
import { type EquippableType, type Prisma, Role } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { baseDataTableQuerySchema } from "~/components/data-table/data-table-utils";
import {
	createTRPCRouter,
	protectedProcedure,
	publicProcedure,
	roleProtectedProcedure,
} from "~/server/api/trpc";
import schema from "~/server/db/json-schema.json";
import {
	getDataById,
	itemDefinitionToDatabaseItem,
} from "~/utils/fo-data/service";
import { COLLECTIBLE_ITEM_TYPES, equipmentSlotConfig } from "~/utils/fo-game";
import { getSlugFromName } from "~/utils/misc";
import { itemSchema } from "./schemas";
import { itemSearchFilterSchema } from "./search-params";

const requiredFields = schema.definitions.Item.required;
const searchFields = ["name", "desc", "slug", "spriteName"];

const itemInclude = {
	boxItems: {
		select: {
			id: true,
			name: true,
			spriteName: true,
			slug: true,
		},
	},
	box: {
		select: {
			id: true,
			name: true,
			spriteName: true,
			slug: true,
		},
	},
	usages: {
		select: {
			item: {
				select: {
					id: true,
					name: true,
					spriteName: true,
					slug: true,
				},
			},
		},
	},
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
			ingredients: {
				include: {
					item: {
						select: {
							id: true,
							name: true,
							spriteName: true,
							slug: true,
						},
					},
				},
			},
		},
		orderBy: {
			durationMinutes: "asc",
		},
	},
} satisfies Prisma.ItemInclude;

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
				type,
				subType,
				collectible,
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

			if (typeof type === "number") {
				conditions.push({
					type: type,
					subType: subType ?? undefined,
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

			if (collectible) {
				conditions.push({
					OR: COLLECTIBLE_ITEM_TYPES.map((type) => ({
						type: type,
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

			const data = await db.item.findMany({
				orderBy: {
					[sort]: isSortFieldRequired
						? sort_dir
						: { sort: sort_dir, nulls: "last" },
				},
				include: itemInclude,
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

	getBySlug: publicProcedure
		.input(z.object({ slug: z.string() }))
		.query(({ ctx: { db, session }, input: { slug } }) => {
			return db.item.findFirst({
				where: {
					slug,
				},
				include: {
					...itemInclude,
					collections: session
						? {
								where: {
									userId: session.user.id,
								},
							}
						: undefined,
				},
			});
		}),

	getAllEquipment: publicProcedure.query(async ({ ctx: { db } }) => {
		return db.item.findMany({
			orderBy: {
				slug: "asc",
			},
			where: {
				OR: [
					{
						type: 2,
					},
					{
						type: 3,
					},
				],
			},
		});
	}),

	getAllQuick: publicProcedure
		.input(z.string().optional())
		.query(async ({ ctx: { db }, input }) => {
			return db.item.findMany({
				orderBy: {
					slug: "asc",
				},
				select: {
					id: true,
					name: true,
					// spriteName: true,
					// slug: true,
				},
				where: input
					? {
							OR: searchFields.map((f) => ({
								[f]: {
									contains: input,
								},
							})),
						}
					: {},
			});
		}),

	create: roleProtectedProcedure(Role.MODERATOR)
		.input(z.object({ data: itemSchema, inGameId: z.number() }))
		.mutation(async ({ ctx: { db }, input }) => {
			const { data, inGameId } = input;

			const { soldBy, craftedBy, battlePassTiers, ...rest } = data;

			const definitionData = await getDataById("items", inGameId);

			if (!definitionData) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: `Item definition not found for id: ${inGameId}`,
				});
			}

			const { boxIds, ...converted } =
				itemDefinitionToDatabaseItem(definitionData);

			return db.item.create({
				data: {
					soldBy: soldBy && {
						createMany: {
							data: soldBy.map(({ npc, ...s }) => ({
								npcId: npc.id,
								...s,
							})),
						},
					},
					craftedBy: craftedBy && {
						createMany: {
							data: craftedBy.map(({ npc, ingredients, ...s }) => ({
								npcId: npc.id,
								...s,
							})),
						},
					},
					battlePassTiers: battlePassTiers && {
						createMany: {
							data: battlePassTiers,
						},
					},
					boxItems: boxIds && {
						connect: boxIds.map((b) => ({ inGameId: b })),
					},
					...converted,
					...rest,
				},
			});
		}),

	update: roleProtectedProcedure(Role.MODERATOR)
		.input(z.object({ id: z.string(), data: itemSchema }))
		.mutation(async ({ ctx: { db }, input }) => {
			const { id, data } = input;
			const { soldBy, craftedBy, battlePassTiers, ...rest } = data;

			let updated = await db.item.update({
				where: {
					id,
				},
				data: {
					...rest,
					soldBy: soldBy && {
						upsert: soldBy.map(({ npc, ...d }) => ({
							create: { ...d, npcId: npc.id },
							update: { ...d, npcId: npc.id },
							where: {
								npcId_itemId: {
									npcId: npc.id,
									itemId: id,
								},
							},
						})),
					},
					craftedBy: craftedBy && {
						upsert: craftedBy.map(({ npc, ingredients, ...d }) => ({
							create: {
								...d,
								npcId: npc.id,
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
							update: { ...d, npcId: npc.id },
							where: {
								npcId_itemId: {
									npcId: npc.id,
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

			const salesToRemove = updated.soldBy.filter((updatedSale) => {
				return !soldBy?.find((inputSale) => {
					return (
						inputSale.npc.id === updatedSale.npcId &&
						inputSale.price === updatedSale.price &&
						inputSale.unit === updatedSale.unit
					);
				});
			});

			// TODO handle removal of craftedBy ingredients
			const craftsToRemove = updated.craftedBy.filter((updatedCraft) => {
				return !craftedBy?.find((inputCraft) => {
					return (
						inputCraft.npc.id === updatedCraft.npcId &&
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
				salesToRemove.length ||
				craftsToRemove.length ||
				tiersToRemove.length
			) {
				updated = await db.item.update({
					where: {
						id,
					},
					data: {
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

	syncDefinition: roleProtectedProcedure(Role.MODERATOR)
		.input(z.object({ inGameId: z.number() }))
		.mutation(async ({ ctx: { db }, input }) => {
			const { inGameId } = input;

			const definitionData = await getDataById("items", inGameId);

			if (!definitionData) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: `Item definition not found for id: ${inGameId}`,
				});
			}

			const { boxIds, ...converted } =
				itemDefinitionToDatabaseItem(definitionData);

			return db.item.update({
				data: {
					definitionUpdatedAt: new Date(),
					boxItems: boxIds && {
						set: boxIds.map((b) => ({ inGameId: b })),
					},
					...converted,
				},
				where: {
					inGameId,
				},
			});
		}),

	delete: roleProtectedProcedure(Role.ADMIN)
		.input(z.object({ id: z.string() }))
		.mutation(({ ctx: { db }, input: { id } }) => {
			return db.item.delete({
				where: { id },
			});
		}),
});
