import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { foApi } from "~/utils/fo-api";

export default createTRPCRouter({
	findGuild: protectedProcedure.input(z.string()).query(async ({ input }) => {
		const result = await foApi.POST("/api/public/guild/members", {
			body: { name: input },
		});

		if (result.error) {
			throw new TRPCError({
				code: "INTERNAL_SERVER_ERROR",
				message: "Error fetching guild details",
			});
		}

		return result.data;
	}),
});
