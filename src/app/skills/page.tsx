import type { SearchParams } from "nuqs/parsers";
import { SkillTable } from "~/features/skills/components/SkillsTable";
import { skillSearchParamCache } from "~/features/skills/search-params";
import { api } from "~/trpc/server";

export const metadata = {
	title: "Skills",
};

export default async function Skills({
	searchParams,
}: { searchParams: SearchParams }) {
	const params = skillSearchParamCache.parse(searchParams);
	const data = await api.skill.getAllPopulated(params);
	return <SkillTable initialData={data} initialParams={params} />;
}
