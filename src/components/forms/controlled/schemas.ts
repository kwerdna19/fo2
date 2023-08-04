import { createUniqueFieldSchema } from "@ts-react/form";
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
  x: z.number().min(0),
  y: z.number().max(0)
}).describe('Coordinates')

export const locationsSchema = z.object({
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


export const spriteSelectSchema = createUniqueFieldSchema(z.string().url().describe('Sprite'), 'sprite')
