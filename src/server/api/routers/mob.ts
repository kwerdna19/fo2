import { z } from "zod";
import { mobSchema } from "~/components/forms/controlled/schemas";
import { createTRPCRouter, moderatorProcedure, publicProcedure } from "~/server/api/trpc";
import { getSlugFromName } from "~/utils/misc";

export const router = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.mob.findMany({
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
    return ctx.db.mob.findUniqueOrThrow({
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
    return ctx.db.mob.findUnique({
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
        },
        locations: true
      }
    })
  }),
  create: moderatorProcedure.input(mobSchema)
  .mutation(async ({ ctx, input }) => {

    const { name, sprite: spriteUrl, drops, locations, ...rest } = input

    return ctx.db.mob.create({
      data: {
        name,
        spriteUrl,
        slug: getSlugFromName(name),
        locations: {
          createMany: {
            data: locations.map(l => ({
              areaId: l.areaId,
              x: l.coordinates.x,
              y: l.coordinates.y
            }))
          }
        },
        drops: {
          createMany: {
            data: drops.map(item => ({
              itemId: item.item.id,
              dropRate: item.dropRate
            }))
          }
        },
        ...rest
      },
      include: {
        drops: true,
        locations: true
      }
    })
  }),
  update: moderatorProcedure.input(z.object({
    id: z.string(),
    data: mobSchema
  })
  )
  .mutation(async ({ ctx, input: { data, id } }) => {

    const { sprite: spriteUrl, drops, locations, ...fields } = data

    let updated = await ctx.db.mob.update({
      where: {
        id
      },
      data: {
        ...fields,
        spriteUrl,
        slug: getSlugFromName(fields.name),
        updatedAt: new Date(),
        drops: {
          upsert: drops.map(({ item, dropRate }) => ({
            create: {
              dropRate: dropRate,
              itemId: item.id
            },
            update: {
              dropRate: dropRate
            },
            where: {
              mobId_itemId: {
                itemId: item.id,
                mobId: id,
              }
            }
          }))
        },
        locations: {
          upsert: locations.map(l => ({
            create: {
              x: l.coordinates.x,
              y: l.coordinates.y,
              areaId: l.areaId,
            },
            update: {
              x: l.coordinates.x,
              y: l.coordinates.y,
              areaId: l.areaId,
            },
            where:
            l.id ? {
              id: l.id
            } : {
              areaId_x_y_mobId: {
                areaId: l.areaId,
                x: l.coordinates.x,
                y: l.coordinates.y,
                mobId: id
              }
            }
          }))
        }
      },
      include: {
        drops: true,
        locations: true
      }
    })

    const itemsToRemove = updated.drops.filter(updatedItem => {
      return !drops.find(inputItem => {
        return inputItem.item.id === updatedItem.itemId
      })
    })

    const locationsToRemove = updated.locations.filter(updatedLocation => {
      return !locations.find(inputLocation => {
        return (
          updatedLocation.areaId === inputLocation.areaId &&
          updatedLocation.x === inputLocation.coordinates.x &&
          updatedLocation.y === inputLocation.coordinates.y &&
          updatedLocation.mobId === id
        )
      })
    })

    if(itemsToRemove.length || locationsToRemove.length) {

      updated = await ctx.db.mob.update({
        where: {
          id
        },
        data: {
          drops: {
            delete: itemsToRemove.map(item => ({
              mobId_itemId: {
                mobId: id,
                itemId: item.itemId
              }
            })),
          },
          locations: {
            delete: locationsToRemove.map(l => ({
              id: l.id
            })),
          }
        },
        include: {
          drops: true,
          locations: true
        }
      })

    }

    return updated

  }),
});
