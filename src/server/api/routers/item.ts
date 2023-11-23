import { type EquippableType, type Item } from "@prisma/client";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { equipmentSlotConfig } from "~/utils/fo";

export const router = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.item.findMany({
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
  }),
  getAllEquipment: publicProcedure.query(({ ctx }) => {
    return ctx.db.item.findMany({
      orderBy: {
        name: 'asc'
      },
      where: {
        equip: {
          in: Object.keys(equipmentSlotConfig) as EquippableType[]
        }
      }
    })
  }),
  getAllQuick: publicProcedure.query(({ ctx }) => {
    return ctx.db.item.findMany({
      orderBy: {
        name: 'asc'
      },
      select: {
        id: true,
        name: true,
        spriteUrl: true
      }
    })
  }),
  getById: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.db.item.findUniqueOrThrow({
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
    return ctx.db.item.findUnique({
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
  }),
  // this can return multiple rows for the same stat is they have equal stat of interest (tied for max)
  getSuperlatives: publicProcedure.input(z.object({
    stat: z.enum(['str', 'int', 'sta', 'agi', 'armor']),
    type: z.enum(['min', 'max']).default('max'),
    maxLevel: z.number().optional()
  })).query(async ({ ctx, input: { stat, type, maxLevel } }) => {

    const result = await ctx.db.$queryRawUnsafe<Item[]>(`
      WITH q AS
      (
        SELECT
            equip, ${type.toUpperCase()}("${stat}")
        FROM
          "Item"
        WHERE
          equip IS NOT NULL AND
          ${type === 'max' ? `${stat} > 0` : `${stat} < 0`}
          ${maxLevel ? `AND "levelReq" <= ${maxLevel}` : ''}
        GROUP BY
          equip
      )
      SELECT
        "Item".*
      FROM
        q,"Item"
      WHERE 
        q.${type} IS NOT NULL AND
        q.${type} = "Item"."${stat}" AND
        q.equip = "Item".equip;
    `)

    return result
  })
});
