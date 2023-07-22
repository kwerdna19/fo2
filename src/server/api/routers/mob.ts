import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const router = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.mob.findMany({
      orderBy: {
        level: 'asc'
      },
      include: {
        drops: {
          include: {
            item: true
          },
          orderBy: {
            item: {
              sellPrice: 'asc'
            }
          }
        }
      }
    })
  })
});
