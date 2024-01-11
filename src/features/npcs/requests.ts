import { type z } from "zod";
import { type npcSchema } from "./schemas";
import { db } from "~/server/db";
import { getSlugFromName } from "~/utils/misc";
import { Unit } from "@prisma/client";


export async function getAllNpcs() {
  return db.npc.findMany({
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
}

export async function getNpcById(id: string) {
  return db.npc.findUniqueOrThrow({
    where: {
      id
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
}

export async function getNpcBySlug(slug: string) {
  return db.npc.findUnique({
    where: {
      slug
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
}


export async function getAllNpcsQuick() {
  return db.npc.findMany({
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

export async function createNpc(input: z.infer<typeof npcSchema>) {

  const { name, items, locations, ...rest } = input

  return db.npc.create({
    data: {
      name,
      slug: getSlugFromName(name),
      locations: locations && {
        createMany: {
          data: locations
        }
      },
      items: items && {
        createMany: {
          data: items.map(({ gems, ...d }) => ({
            ...d,
            unit: gems ? Unit.GEMS : Unit.COINS
          }))
        }
      },
      ...rest
    }
  })

}

export async function updateNpc(id: string, data: z.infer<typeof npcSchema>) {

  const { items, locations, ...fields } = data

  let updated = await db.npc.update({
    where: {
      id
    },
    data: {
      ...fields,
      slug: getSlugFromName(fields.name),
      updatedAt: new Date(),
      items: items && {
        upsert: items.map(({ gems, ...d }) => ({ 
          create: {
            ...d,
            unit: gems ? Unit.GEMS : Unit.COINS
          },
          update: {},
          where: {
            npcId_itemId: {
              itemId: d.itemId,
              npcId: id
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
      items: true,
      locations: true
    }
  })

  const itemsToRemove = items ? updated.items.filter(updatedItem => {
    return !items.find(inputItem => {
      return (inputItem.itemId === updatedItem.itemId &&
        inputItem.price === updatedItem.price &&
        inputItem.gems === (updatedItem.unit === Unit.GEMS)
        )
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

    updated = await db.npc.update({
      where: {
        id
      },
      data: {
        items: {
          delete: itemsToRemove.map(item => ({
            npcId_itemId: {
              npcId: id,
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
        items: true,
        locations: true
      }
    })

  }

  return updated


}
