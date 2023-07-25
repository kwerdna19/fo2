import { router as mobRouter } from "~/server/api/routers/mob";
import { router as itemRouter } from "~/server/api/routers/item";

import { createTRPCRouter } from "~/server/api/trpc";


export const appRouter = createTRPCRouter({
  mob: mobRouter,
  item: itemRouter
});

export type AppRouter = typeof appRouter;
