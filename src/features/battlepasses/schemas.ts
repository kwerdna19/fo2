import { z } from "zod";
import { Unit } from "@prisma/client";


export const battlePassTierSchema = z.object({
  // tier: z.number(), // auto assign based on index
  itemId: z.string().optional(),
  amount: z.number().int().optional(),
  unit: z.nativeEnum(Unit).optional(),
})


export const battlePassSchema = z.object({
  name: z.string(),
  tiers: battlePassTierSchema.array().optional(),
  startDate: z.date(),
  endDate: z.date().optional(),
  desc: z.string().optional(),
  note: z.string().optional()
})


