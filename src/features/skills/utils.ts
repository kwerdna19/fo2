import type { Skill } from "@prisma/client";
import { getSlugFromName } from "~/utils/misc";

export const getSkillNameIdSlug = (d: Pick<Skill, "id" | "name" | "rank">) => {
	const base = getSlugFromName(d.name);
	return `${base}-${d.rank}-${d.id}`;
};
