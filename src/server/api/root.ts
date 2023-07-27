import { router as mobRouter } from "~/server/api/routers/mob";
import { router as itemRouter } from "~/server/api/routers/item";
import { router as areaRouter } from "~/server/api/routers/area";

import { createTRPCRouter } from "~/server/api/trpc";


export const appRouter = createTRPCRouter({
  mob: mobRouter,
  item: itemRouter,
  area: areaRouter
});

export type AppRouter = typeof appRouter;
