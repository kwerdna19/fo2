import { z } from "zod";
import { EquippableType } from '@prisma/client';


export const droppedBySchema = z.object({
  mobId: z.string(),
  dropRate: z.number().optional(),
}).array()

export const soldBySchema = z.object({
  npcId: z.string(),
  gems: z.boolean().optional(),
  price: z.number().int(),
}).array()

export const itemSchema = z.object({
  name: z.string(),
  desc: z.string().optional(),
  note: z.string().optional(),
  spriteUrl: z.string(),
  equip: z.string().refine(arg => !!EquippableType[arg as EquippableType]).optional(),
  levelReq: z.number().int().optional(),
  twoHand: z.boolean().optional(),
  consumable: z.boolean().optional(),
  sellPrice: z.number().int().optional(),
  stackSize: z.number().int().optional(),
  unobtainable: z.boolean().optional(),
  reqStr: z.number().int().optional(),
  reqSta: z.number().int().optional(),
  reqAgi: z.number().int().optional(),
  reqInt: z.number().int().optional(),
  range: z.number().int().optional(),

  str: z.number().int().optional(),
  sta: z.number().int().optional(),
  agi: z.number().int().optional(),
  int: z.number().int().optional(),
  armor: z.number().int().optional(),

  atkSpeed: z.number().optional(),
  dmgMin: z.number().int().optional(),
  dmgMax: z.number().int().optional(),

  droppedBy: droppedBySchema.optional(),
  soldBy: soldBySchema.optional()
})
