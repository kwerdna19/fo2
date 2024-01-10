import { type EquippableType } from "@prisma/client";
import { db } from "~/server/db";
import { equipmentSlotConfig } from "~/utils/fo";
import { type itemSchema } from "./schemas";
import { type z } from "zod";
import { getSlugFromName } from "~/utils/misc";


export async function getAllItems() {
  return db.item.findMany({
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
      },
      soldBy: {
        include: {
          npc: true
        },
        orderBy: {
          price: 'asc'
        }
      }
    }
  })
}

export async function getAllEquipment() {
  return db.item.findMany({
    orderBy: {
      name: 'asc'
    },
    where: {
      equip: {
        in: Object.keys(equipmentSlotConfig) as EquippableType[]
      }
    }
  })
}

export async function getAllItemsQuick() {
  return db.item.findMany({
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

export async function getItemById(id: string) {
  return db.item.findUniqueOrThrow({
    where: {
      id
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
}

export async function getItemBySlug(slug: string) {
  return db.item.findUnique({
    where: {
      slug
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
}


export async function createItem(input: z.infer<typeof itemSchema>) {

  const { name, droppedBy, equip, ...rest } = input

  return db.item.create({
    data: {
      name,
      equip: equip as EquippableType,
      slug: getSlugFromName(name),
      droppedBy: droppedBy && {
        create: droppedBy
      },
      ...rest
    }
  })

}

export async function updateItem(id: string, data: z.infer<typeof itemSchema>) {

  const { name, droppedBy, equip, ...rest } = data

  let updated = await db.item.update({
    where: {
      id
    },
    data: {
      name,
      equip: equip as EquippableType,
      slug: getSlugFromName(name),
      updatedAt: new Date(),
      ...rest,
      droppedBy: droppedBy && {
        upsert: droppedBy.map(d => ({
          create: d,
          update: d,
          where: {
            mobId_itemId: {
              mobId: d.mobId,
              itemId: id
            }
          }
        }))
      }      
    },
    include: {
      droppedBy: true
    }
  })

  const dropsToRemove = droppedBy ? updated.droppedBy.filter(updatedDrop => {
    return !droppedBy.find(inputDrop => {
      return inputDrop.mobId === updatedDrop.itemId
    })
  }) : []

  if(dropsToRemove.length) {

    updated = await db.item.update({
      where: {
        id
      },
      data: {
        droppedBy: {
          delete: dropsToRemove.map(item => ({
            mobId_itemId: {
              mobId: item.mobId,
              itemId: id
            }
          })),
        }
      },
      include: {
        droppedBy: true
      }
    })

  }

  return updated

}