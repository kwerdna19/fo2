import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const router = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.item.findMany({
      orderBy: {
        name: 'asc'
      },
      include: {
        droppedBy: {
          include: {
            mob: true
          },
          orderBy: {
            mob: {
              level: 'asc'
            }
          }
        }
      }
    })
  }),
  getById: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.item.findUniqueOrThrow({
      where: {
        id: input
      },
      include: {
        droppedBy: {
          include: {
            mob: true
          },
          orderBy: {
            mob: {
              level: 'asc'
            }
          }
        }
      }
    })
  }),
  getBySlug: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.item.findUnique({
      where: {
        slug: input
      },
      include: {
        droppedBy: {
          include: {
            mob: true
          },
          orderBy: {
            mob: {
              level: 'asc'
            }
          }
        }
      }
    })
  })
});
