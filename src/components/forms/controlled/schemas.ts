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

export const itemsSchema = z.object({
  id: z.string(),
  name: z.string(),
}).array().describe('Items')