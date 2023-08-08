import { createUniqueFieldSchema } from "~/utils/ts-react-form";
import { z } from "zod";

export const nameSchema = z.string().describe('Name')

export const selectedAreaSchema = z.object({
  name: z.string(),
  id: z.string(),
  spriteUrl: z.string(),
  width: z.number(),
  height: z.number()
}).describe('Area')

export const coordinatesSchema = z.object({
  x: z.number(),
  y: z.number()
}).describe('Coordinates')

export const locationsSchema = z.object({
  id: z.string().optional(), // needed for dynamic removal / addition
  coordinates: coordinatesSchema,
  areaId: z.string()
}).array().describe('Locations')

export const itemSchema = z.object({
  id: z.string(),
  name: z.string(),
}).describe('Item')

export const saleItemsSchema = z.object({
  item: itemSchema,
  price: z.number(),
}).array().describe('Sale Items')

export const npcTypeSchema = z.enum(["Storage", "Shop", "Quest", "Market"]).describe('Type')


export const spriteSelectSchema = createUniqueFieldSchema(z.string().describe('Sprite'), 'sprite')

export const npcSchema = z.object({
  name: nameSchema,
  type: npcTypeSchema,
  sprite: spriteSelectSchema,
  locations: locationsSchema,
  items: saleItemsSchema,
})

