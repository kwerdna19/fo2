import { z } from "zod";

export const factionSchema = z.object({
	name: z.string(),
	desc: z.string().nullish(),
	note: z.string().nullish(),
});
