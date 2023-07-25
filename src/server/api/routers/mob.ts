import { z } from "zod";
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
  }),
  getById: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.mob.findUniqueOrThrow({
      where: {
        id: input
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
  }),
  getBySlug: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.mob.findUnique({
      where: {
        slug: input
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
