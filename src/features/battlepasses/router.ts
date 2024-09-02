import { Role } from "@prisma/client";
import { z } from "zod";

import {
	createTRPCRouter,
	publicProcedure,
	roleProtectedProcedure,
} from "~/server/api/trpc";
import { getSlugFromName } from "~/utils/misc";
import { battlePassSchema } from "./schemas";

export default createTRPCRouter({
	getAllPopulated: publicProcedure.query(({ ctx: { db } }) => {
		return db.battlePass.findMany({
			include: {
				tiers: {
					include: {
						item: {
							select: {
								slug: true,
								name: true,
								spriteUrl: true,
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
			select: {
				id: true,
				name: true,
				slug: true,
			},
		});
	}),

	getCurrent: publicProcedure.query(({ ctx: { db } }) => {
		return db.battlePass.findFirst({
			include: {
				tiers: {
					include: {
						item: {
							select: {
								slug: true,
								name: true,
								spriteUrl: true,
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
				tiers: {
					include: {
						item: {
							select: {
								slug: true,
								name: true,
								spriteUrl: true,
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

	getBySlug: publicProcedure
		.input(z.object({ slug: z.string() }))
		.query(({ ctx: { db }, input: { slug } }) => {
			return db.battlePass.findUnique({
				include: {
					tiers: {
						include: {
							item: {
								select: {
									slug: true,
									name: true,
									spriteUrl: true,
								},
							},
						},
						orderBy: {
							tier: "asc",
						},
					},
				},
				where: {
					slug,
				},
			});
		}),

	create: roleProtectedProcedure(Role.MODERATOR)
		.input(battlePassSchema)
		.mutation(({ ctx: { db }, input }) => {
			const { name, tiers, ...rest } = input;

			return db.battlePass.create({
				data: {
					name,
					slug: getSlugFromName(name),
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
		.input(z.object({ id: z.string(), data: battlePassSchema }))
		.mutation(async ({ ctx: { db }, input }) => {
			const { id, data } = input;
			const { name, tiers, ...fields } = data;

			// @TODO db commit to prevent data loss?
			// all deleted before to prevent composite key clashing
			await db.battlePassTier.deleteMany({
				where: {
					battlePassId: id,
				},
			});

			const updated = await db.battlePass.update({
				where: {
					id,
				},
				data: {
					name,
					slug: getSlugFromName(name),
					...fields,
					tiers: tiers && {
						createMany: {
							data: tiers.map((t, i) => ({
								...t,
								tier: i + 1,
							})),
						},
					},
				},
				include: {
					tiers: true,
				},
			});

			return updated;
		}),

	delete: roleProtectedProcedure(Role.ADMIN)
		.input(z.object({ id: z.string() }))
		.mutation(({ ctx: { db }, input }) => {
			return db.battlePass.delete({
				where: { id: input.id },
			});
		}),
});
