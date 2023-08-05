import { z } from "zod";
import { locationsSchema, nameSchema, npcTypeSchema, saleItemsSchema } from "~/components/forms/controlled/schemas";
import { createTRPCRouter, moderatorProcedure, publicProcedure } from "~/server/api/trpc";

export const router = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.npc.findMany({
      orderBy: {
        name: 'asc'
      },
      include: {
        items: {
          include: {
            item: true
          }
        },
        locations: {
          include: {
            area: true,
          }
        }
      }
    })
  }),
  getById: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.npc.findUniqueOrThrow({
      where: {
        id: input
      },
      include: {
        items: {
          include: {
            item: true
          }
        },
        locations: {
          include: {
            area: true,
          }
        }
      }
    })
  }),
  getBySlug: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.npc.findUnique({
      where: {
        slug: input
      },
      include: {
        items: {
          include: {
            item: true
          }
        },
        locations: {
          include: {
            area: true,
          }
        }
      }
    })
  }),
  // needed instead of createNpc schema due to bug with react-ts-form
  create: moderatorProcedure.input(z.object({
    name: nameSchema,
    type: npcTypeSchema,
    sprite: z.string(),
    locations: locationsSchema,
    items: saleItemsSchema,
  })).mutation(async ({ ctx, input }) => {

    await new Promise(res => setTimeout(res, 2000))

    const { name, sprite: spriteUrl, items, locations, type } = input

    return ctx.prisma.npc.create({
      data: {
        name,
        spriteUrl,
        slug: name.replace(/\s+/g, '-').replace(/[^a-zA-Z\d]/g, '').toLowerCase(),
        type: type,
        locations: {
          createMany: {
            data: locations.map(l => ({
              areaId: l.areaId,
              x: l.coordinates.x,
              y: l.coordinates.y
            }))
          }
        },
        items: {
          createMany: {
            data: items.map(item => ({
              itemId: item.item.id,
              price: item.price
            }))
          }
        }
      }
    })
  }),
});
