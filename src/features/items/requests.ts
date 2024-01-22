import { Unit, type EquippableType } from "@prisma/client";
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
      },
      soldBy: {
        include: {
          npc: true,
        },
      }
    }
  })
}


export async function createItem(input: z.infer<typeof itemSchema>) {

  const { name, droppedBy, equip, soldBy, ...rest } = input

  return db.item.create({
    data: {
      name,
      equip: equip as EquippableType,
      slug: getSlugFromName(name),
      droppedBy: droppedBy && {
        create: droppedBy
      },
      soldBy: soldBy && {
        create: soldBy.map(({gems, ...d}) => ({
          ...d,
          unit: gems ? Unit.GEMS : Unit.COINS
        }))
      },
      ...rest
    }
  })

}

export async function updateItem(id: string, data: z.infer<typeof itemSchema>) {

  const { name, droppedBy, equip, soldBy, ...rest } = data

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
      },
      soldBy: soldBy && {
        upsert: soldBy.map(({ gems, ...d }) => ({
          create: {
            ...d,
            unit: gems ? Unit.GEMS : Unit.COINS
          },
          update: {
            ...d,
            unit: gems ? Unit.GEMS : Unit.COINS
          },
          where: {
            npcId_itemId: {
              npcId: d.npcId,
              itemId: id
            }
          }
        }))
      }     
    },
    include: {
      droppedBy: true,
      soldBy: true
    }
  })

  const dropsToRemove = droppedBy ? updated.droppedBy.filter(updatedDrop => {
    return !droppedBy.find(inputDrop => {
      return (inputDrop.mobId === updatedDrop.mobId
        && inputDrop.dropRate === updatedDrop.dropRate
      )
    })
  }) : []

  const salesToRemove = soldBy ? updated.soldBy.filter(updatedSale => {
    return !soldBy.find(inputSale => {
      return (
        inputSale.npcId === updatedSale.npcId && 
        inputSale.price === updatedSale.price && 
        inputSale.gems === (updatedSale.unit === Unit.GEMS)
      )
    })
  }) : []

  if(dropsToRemove.length || salesToRemove.length) {

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
        },
        soldBy: {
          delete: salesToRemove.map(s => ({
            npcId_itemId: {
              npcId: s.npcId,
              itemId: id
            }
          }))
        }
      },
      include: {
        droppedBy: true,
        soldBy: true
      }
    })

  }

  return updated

}

export async function deleteItem(id: string) {
  return db.item.delete({
    where: { id }
  })
}