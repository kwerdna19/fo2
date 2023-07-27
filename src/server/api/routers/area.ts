import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const router = createTRPCRouter({
  getAllQuick: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.area.findMany({
      orderBy: {
        createdAt: 'asc'        
      },
      select: {
        id: true,
        name: true,
        slug: true,
        note: true
      }
    })
  }),
  getAllPopulated: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.area.findMany({
      orderBy: {
        createdAt: 'asc'        
      },
      include: {
        locations: {
          include: {
            mob: true,
            npc: true
          }
        }
      }
    })
  }),
  getBySlug: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.area.findUnique({
      where: {
        slug: input
      },
      include: {
        locations: {
          include: {
            mob: true,
            npc: true
          }
        }
      }
    })
  })
});
