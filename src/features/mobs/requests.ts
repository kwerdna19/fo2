import { type z } from "zod";
import { db } from "~/server/db";
import { getSlugFromName } from "~/utils/misc";
import { type mobSchema } from "./schemas";


export async function getAllMobs() {
  return db.mob.findMany({
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
}

export async function getMobById(id: string) {
  return db.mob.findUniqueOrThrow({
    where: {
      id
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
}

export async function getMobBySlug(slug: string) {
  return db.mob.findUnique({
    where: {
      slug
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
}

export async function getAllMobsQuick() {
  return db.mob.findMany({
    orderBy: {
      name: 'asc'
    },
    select: {
      id: true,
      name: true,
      spriteUrl: true
    }
  })
}

export async function createMob(input: z.infer<typeof mobSchema>) {

  const { name, drops, locations, ...rest } = input

  return db.mob.create({
    data: {
      name,
      slug: getSlugFromName(name),
      locations: locations && {
        createMany: {
          data: locations
        }
      },
      drops: drops && {
        createMany: {
          data: drops
        }
      },
      ...rest
    }
  })

}

export async function updateMob(id: string, data: z.infer<typeof mobSchema>) {

  const { drops, locations, ...fields } = data

  let updated = await db.mob.update({
    where: {
      id
    },
    data: {
      ...fields,
      slug: getSlugFromName(fields.name),
      updatedAt: new Date(),
      drops: drops && {
        upsert: drops.map(({ itemId, dropRate }) => ({ 
          create: {
            dropRate,
            itemId
          },
          update: {
            dropRate
          },
          where: {
            mobId_itemId: {
              itemId,
              mobId: id,
            }
          }
        }))
      },
      locations: locations && {
        upsert: locations.map(l => ({
          create: l,
          update: l,
          where: {
            areaId_x_y_mobId: {
              areaId: l.areaId,
              x: l.x,
              y: l.y,
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

  const itemsToRemove = drops ? updated.drops.filter(updatedItem => {
    return !drops.find(inputItem => {
      return (inputItem.itemId === updatedItem.itemId &&
        inputItem.dropRate === updatedItem.dropRate)
    })
  }) : []

  const locationsToRemove = locations ? updated.locations.filter(updatedLocation => {
    return !locations.find(inputLocation => {
      return (
        updatedLocation.areaId === inputLocation.areaId &&
        updatedLocation.x === inputLocation.x &&
        updatedLocation.y === inputLocation.y
      )
    })
  }) : []

  if(itemsToRemove.length || locationsToRemove.length) {

    updated = await db.mob.update({
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


}