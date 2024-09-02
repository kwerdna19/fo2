import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export default createTRPCRouter({
	getAllQuick: publicProcedure.query(({ ctx: { db } }) => {
		return db.area.findMany({
			orderBy: {
				createdAt: "asc",
			},
			select: {
				id: true,
				name: true,
				slug: true,
				spriteUrl: true,
				width: true,
				height: true,
				note: true,
			},
		});
	}),

	getAllPopulated: publicProcedure.query(({ ctx: { db } }) => {
		return db.area.findMany({
			orderBy: {
				createdAt: "asc",
			},
			include: {
				locations: {
					include: {
						mob: {
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
						},
						npc: true,
					},
				},
			},
		});
	}),

	getBySlug: publicProcedure
		.input(z.object({ slug: z.string() }))
		.query(({ ctx: { db }, input: { slug } }) => {
			return db.area.findUnique({
				where: { slug },
				include: {
					locations: {
						include: {
							mob: {
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
							},
							npc: {
								include: {
									items: {
										include: {
											item: true,
										},
										orderBy: {
											price: "asc",
										},
									},
								},
							},
						},
					},
				},
			});
		}),
});
