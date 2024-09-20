import { z } from "zod";
import { locationsSchema } from "../areas/schemas";

export const mobSchema = z.object({
	boss: z.boolean().optional(),
	locations: locationsSchema,
});
