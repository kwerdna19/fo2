import { z } from "zod";
import { locationsSchema } from "../areas/schemas";
import { Unit } from "@prisma/client";

export const saleItemsSchema = z.object({
  itemId: z.string(),
  price: z.number(),
  unit: z.nativeEnum(Unit).optional(),
}).array()

export const itemIngredientSchema = z.object({
  itemId: z.string(),
  quantity: z.number(),
})

export const craftItemsSchema = z.object({
  itemId: z.string(),
  price: z.number(),
  durationMinutes: z.number(),
  unit: z.nativeEnum(Unit).optional(),
  ingredients: itemIngredientSchema.array().optional()
}).array()


export const npcTypes = ["Storage", "Shop", "Quest", "Market", "Craft", "Teleport", "Service"]

export const npcSchema = z.object({
  name: z.string(),
  type: z.string().refine(s => npcTypes.includes(s)),
  spriteUrl: z.string(),
  locations: locationsSchema.optional(),
  items: saleItemsSchema.optional(),
  crafts: craftItemsSchema.optional()
})


