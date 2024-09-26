import { z } from "zod";

export const factionSchema = z.object({
	name: z.string(),
	note: z.string().nullish(),
});
