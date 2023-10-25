import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const router = createTRPCRouter({
  getAllQuick: publicProcedure.query(({ ctx }) => {
    return ctx.db.area.findMany({
      orderBy: {
        createdAt: 'asc'        
      },
      select: {
        id: true,
        name: true,
        slug: true,
        spriteUrl: true,
        width: true,
        height: true,
        note: true
      }
    })
  }),
  getAllPopulated: publicProcedure.query(({ ctx }) => {
    return ctx.db.area.findMany({
      orderBy: {
        createdAt: 'asc'        
      },
      include: {
        locations: {
          include: {
            mob: {
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
            },
            npc: true
          }
        }
      }
    })
  }),
  getBySlug: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.db.area.findUnique({
      where: {
        slug: input
      },
      include: {
        locations: {
          include: {
            mob: {
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
            },
            npc: {
              include: {
                items: {
                  include: {
                    item: true
                  },
                  orderBy: {
                    price: 'asc'
                  }
                }
              }
            },
          }
        }
      },
    })
  })
});
