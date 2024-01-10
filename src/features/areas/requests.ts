import { db } from "~/server/db";

export async function getAllAreasQuick() {
    return db.area.findMany({
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
}

export async function getAllAreasPopulated() {
  return db.area.findMany({
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
}

export async function getAreaBySlug(slug: string) {
  return db.area.findUnique({
    where: { slug },
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
}