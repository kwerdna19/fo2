import { Role } from "@prisma/client";
import { z } from "zod";

import {
	createTRPCRouter,
	publicProcedure,
	roleProtectedProcedure,
} from "~/server/api/trpc";
import { battlePassSchema } from "./schemas";

export default createTRPCRouter({
	getAllPopulated: publicProcedure.query(({ ctx: { db } }) => {
		return db.battlePass.findMany({
			include: {
				tiers: {
					include: {
						item: {
							select: {
								id: true,
								name: true,
								spriteName: true,
							},
						},
					},
					orderBy: {
						tier: "asc",
					},
				},
			},
		});
	}),

	getAllQuick: publicProcedure.query(({ ctx: { db } }) => {
		return db.battlePass.findMany({
			include: {
				item: true,
			},
		});
	}),

	getCurrent: publicProcedure.query(({ ctx: { db } }) => {
		return db.battlePass.findFirst({
			include: {
				item: true,
				tiers: {
					include: {
						item: {
							select: {
								id: true,
								spriteName: true,
								name: true,
							},
						},
					},
					orderBy: {
						tier: "asc",
					},
				},
			},
			// TODO - this wont work as a way to always get the "CURRENT" bp
			orderBy: {
				createdAt: "desc",
			},
		});
	}),

	getNext: publicProcedure.query(({ ctx: { db } }) => {
		return db.battlePass.findFirst({
			include: {
				item: true,
				tiers: {
					include: {
						item: {
							select: {
								id: true,
								name: true,
								spriteName: true,
							},
						},
					},
					orderBy: {
						tier: "asc",
					},
				},
			},
			// TODO - this wont work as a way to always get the "NEXT" bp
			skip: 1,
			orderBy: {
				createdAt: "desc",
			},
		});
	}),

	getById: publicProcedure
		.input(z.number())
		.query(({ ctx: { db }, input: id }) => {
			return db.battlePass.findUnique({
				include: {
					item: true,
					tiers: {
						include: {
							item: {
								select: {
									id: true,
									name: true,
									spriteName: true,
								},
							},
						},
						orderBy: {
							tier: "asc",
						},
					},
				},
				where: {
					itemId: id,
				},
			});
		}),

	create: roleProtectedProcedure(Role.MODERATOR)
		.input(battlePassSchema)
		.mutation(({ ctx: { db }, input }) => {
			const { tiers, item, ...rest } = input;

			return db.battlePass.create({
				data: {
					itemId: item.id,
					tiers: tiers && {
						createMany: {
							data: tiers.map((d, index) => ({
								...d,
								tier: index + 1,
							})),
						},
					},
					...rest,
				},
			});
		}),

	update: roleProtectedProcedure(Role.MODERATOR)
		.input(
			z.object({ id: z.number(), data: battlePassSchema.omit({ item: true }) }),
		)
		.mutation(async ({ ctx: { db }, input }) => {
			const { id, data } = input;
			const { tiers, ...fields } = data;

			const updated = await db.battlePass.update({
				where: {
					itemId: id,
				},
				data: {
					...fields,
					tiers: {
						deleteMany: {},
						createMany: {
							data: tiers.map((t, i) => ({
								...t,
								tier: i + 1,
							})),
						},
					},
				},
			});

			return updated;
		}),

	delete: roleProtectedProcedure(Role.ADMIN)
		.input(z.number())
		.mutation(({ ctx: { db }, input }) => {
			return db.battlePass.delete({
				where: { itemId: input },
			});
		}),
});
