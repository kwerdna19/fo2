import area from "~/features/areas/router";
import battlePass from "~/features/battlepasses/router";
import collection from "~/features/collection/router";
import faction from "~/features/factions/router";
import guild from "~/features/guilds/router";
import item from "~/features/items/router";
import mob from "~/features/mobs/router";
import npc from "~/features/npcs/router";
import skill from "~/features/skills/router";

import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
	area,
	battlePass,
	faction,
	item,
	mob,
	npc,
	skill,
	collection,
	guild,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
