import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export default createTRPCRouter({
	getAllQuick: publicProcedure.query(({ ctx: { db } }) => {
		return db.faction.findMany({
			select: {
				id: true,
				name: true,
				slug: true,
			},
		});
	}),
});
