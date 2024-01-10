import { type z } from "zod";
import { type npcSchema } from "./schemas";
import { db } from "~/server/db";

const getSlugFromName = (name: string) => name.replace(/\s+/g, '-').replace(/[^a-zA-Z\d-]/g, '').toLowerCase()


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

// export async function createNpc(input: z.infer<typeof npcSchema>) {

//   const { name, sprite: spriteUrl, items, locations, type } = input

//   return db.npc.create({
//     data: {
//       name,
//       spriteUrl,
//       slug: getSlugFromName(name),
//       type: type,
//       locations: {
//         createMany: {
//           data: locations.map(l => ({
//             areaId: l.areaId,
//             x: l.coordinates.x,
//             y: l.coordinates.y
//           }))
//         }
//       },
//       items: {
//         createMany: {
//           data: items.map(item => ({
//             itemId: item.item.id,
//             price: item.price
//           }))
//         }
//       }
//     },
//     include: {
//       items: true,
//       locations: true
//     }
//   })

// }

// export async function updateNpc(id: string, data: z.infer<typeof npcSchema>) {

//   const { sprite: spriteUrl, items, locations, ...fields } = data

//   let updated = await db.npc.update({
//     where: {
//       id
//     },
//     data: {
//       ...fields,
//       spriteUrl,
//       slug: getSlugFromName(fields.name),
//       updatedAt: new Date(),
//       items: {
//         upsert: items.map(({ item, price }) => ({
//           create: {
//             price: price,
//             itemId: item.id
//           },
//           update: {
//             price: price
//           },
//           where: {
//             npcId_itemId: {
//               itemId: item.id,
//               npcId: id
//             }
//           }
//         }))
//       },
//       locations: {
//         upsert: locations.map(l => ({
//           create: {
//             x: l.coordinates.x,
//             y: l.coordinates.y,
//             areaId: l.areaId,
//           },
//           update: {
//             x: l.coordinates.x,
//             y: l.coordinates.y,
//             areaId: l.areaId,
//           },
//           where: l.id ? {
//             id: l.id
//           } : {
//             areaId_x_y_npcId: {
//               areaId: l.areaId,
//               x: l.coordinates.x,
//               y: l.coordinates.y,
//               npcId: id
//             }
//           }
//         }))
//       }
//     },
//     include: {
//       items: true,
//       locations: true
//     }
//   })

//   const itemsToRemove = updated.items.filter(updatedItem => {
//     return !items.find(inputItem => {
//       return inputItem.item.id === updatedItem.itemId
//     })
//   })

//   // TODO - verify
//   const locationsToRemove = updated.locations.filter(updatedLocation => {
//     return !locations.find(inputLocation => {
//       return (
//         updatedLocation.areaId === inputLocation.areaId &&
//         updatedLocation.x === inputLocation.coordinates.x &&
//         updatedLocation.y === inputLocation.coordinates.y &&
//         updatedLocation.npcId === id
//       )
//     })
//   })

//   if(itemsToRemove.length || locationsToRemove.length) {

//     updated = await db.npc.update({
//       where: {
//         id
//       },
//       data: {
//         items: {
//           delete: itemsToRemove.map(item => ({
//             npcId_itemId: {
//               npcId: id,
//               itemId: item.itemId
//             }
//           })),
//           // update: itemsToUpdate.map(({ item, ...otherFields }) => ({
//           //   data: otherFields,
//           //    where: {
//           //     npcId_itemId: {
//           //       itemId: item.id,
//           //       npcId: id
//           //     }
//           //    }
//           // }))
//         },
//         locations: {
//           delete: locationsToRemove.map(l => ({
//             id: l.id
//           })),
//         }
//       },
//       include: {
//         items: true,
//         locations: true
//       }
//     })

//   }

//   return updated


// }
