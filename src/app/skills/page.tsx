import type { SearchParams } from "nuqs/parsers";
import { SkillTable } from "~/features/skills/components/SkillsTable";
import { skillSearchParamCache } from "~/features/skills/search-params";
import { api } from "~/trpc/server";

export const metadata = {
	title: "Skills",
};

export const revalidate = 86400;

export default async function Skills({
	searchParams,
}: { searchParams: SearchParams }) {
	const skills = await api.skill.getAllPopulated(
		skillSearchParamCache.parse(searchParams),
	);
	return <SkillTable data={skills} />;
}
