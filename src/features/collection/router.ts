import { z } from "zod";

import {
	createTRPCRouter,
	protectedProcedure,
	publicProcedure,
} from "~/server/api/trpc";
import { cosmeticEquipment, visibleEquipment } from "~/utils/fo-game";

export default createTRPCRouter({
	getMyCollection: protectedProcedure.query(
		async ({ ctx: { db, session } }) => {
			return db.collectionItem.findMany({
				where: {
					userId: session.user.id,
				},
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
			});
		},
	),
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

	getNumCollectibleItems: publicProcedure.query(async ({ ctx: { db } }) => {
		return db.item.count({
			where: {
				OR: [2, 3, 6].map((type) => ({
					type: type,
				})),
			},
		});
	}),
});
