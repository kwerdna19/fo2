import { z } from "zod";
import { itemSchema } from "../items/schemas";
import { locationsSchema } from "../areas/schemas";

export const saleItemsSchema = z.object({
  item: itemSchema,
  price: z.number(),
}).array()

export const npcTypeSchema = z.enum(["Storage", "Shop", "Quest", "Market"])

export const npcSchema = z.object({
  name: z.string(),
  type: npcTypeSchema,
  sprite: z.string(),
  locations: locationsSchema,
  items: saleItemsSchema,
})


