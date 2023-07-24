import { router as mobRouter } from "~/server/api/routers/mob";
import { createTRPCRouter } from "~/server/api/trpc";


export const appRouter = createTRPCRouter({
  mob: mobRouter
});

export type AppRouter = typeof appRouter;
