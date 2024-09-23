import { z } from "zod";

import type { Prisma } from "@prisma/client";
import { baseDataTableQuerySchema } from "~/components/data-table/data-table-utils";
import {
	createTRPCRouter,
	protectedProcedure,
	publicProcedure,
} from "~/server/api/trpc";
import schema from "~/server/db/json-schema.json";
import { COLLECTIBLE_ITEM_TYPES } from "~/utils/fo-game";
import { collectionSearchFilterSchema } from "./search-params";

const itemRequiredFields = schema.definitions.Item.required;

const searchFields = ["name", "desc", "slug", "spriteName"];

export default createTRPCRouter({
	getMyCollection: protectedProcedure
		.input(collectionSearchFilterSchema.and(baseDataTableQuerySchema))
		.query(async ({ ctx: { db, session }, input }) => {
			const { page, per_page, sort, sort_dir, query, type, subType } = input;

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

			const where =
				conditions.length === 1
					? conditions[0]
					: conditions.length > 1
						? {
								AND: conditions,
							}
						: {};

			const isItemSortFieldRequired = itemRequiredFields.includes(sort);

			const isItemSort = !["addedAt", "quantity"].includes(sort);

			const collectionItems = await db.collectionItem.findMany({
				where: {
					userId: session.user.id,
					item: where,
				},
				select: {
					addedAt: true,
					quantity: true,
					item: true,
				},
				orderBy: isItemSort
					? {
							item: {
								[sort]: isItemSortFieldRequired
									? sort_dir
									: { sort: sort_dir, nulls: "last" },
							},
						}
					: {
							[sort]: sort_dir,
						},
				take: per_page,
				skip: pageIndex * per_page,
			});

			const totalCount = await db.collectionItem.count({
				where: { item: where, userId: session.user.id },
			});

			const data = collectionItems.map(({ item, ...rest }) => ({
				...item,
				...rest,
			}));

			return {
				data,
				totalCount,
				totalPages: Math.ceil(totalCount / per_page),
			};
		}),
	addToCollection: protectedProcedure
		.input(z.object({ itemId: z.string() }))
		.mutation(({ ctx: { db, session }, input: { itemId } }) => {
			return db.collectionItem.upsert({
				where: {
					userId_itemId: {
						itemId,
						userId: session.user.id,
					},
				},
				create: {
					itemId,
					userId: session.user.id,
				},
				update: {
					addedAt: new Date(),
				},
			});
		}),

	removeFromCollection: protectedProcedure
		.input(z.object({ itemId: z.string() }))
		.mutation(({ ctx: { db, session }, input: { itemId } }) => {
			return db.collectionItem.delete({
				where: {
					userId_itemId: {
						itemId,
						userId: session.user.id,
					},
				},
				include: {
					item: {
						select: {
							name: true,
						},
					},
				},
			});
		}),

	ownedMap: protectedProcedure.query(async ({ ctx: { db, session } }) => {
		const items = await db.collectionItem.findMany({
			select: {
				itemId: true,
			},
			where: {
				userId: session.user.id,
			},
		});

		const map = items.reduce(
			(acc, item) => {
				acc[item.itemId] = 1;
				return acc;
			},
			{} as Record<string, 1 | 0>,
		);

		return map;
	}),

	getNumCollectibleItems: publicProcedure.query(async ({ ctx: { db } }) => {
		return db.item.count({
			where: {
				AND: [
					{
						name: {
							not: {
								startsWith: "[SSC]",
							},
						},
					},
					{
						OR: COLLECTIBLE_ITEM_TYPES.map((type) => ({
							type: type,
						})),
					},
				],
			},
		});
	}),
});
