import type { SearchParams } from "nuqs/parsers";
import { SkillTable } from "~/features/skills/components/SkillsTable";
import { getAllSkills } from "~/features/skills/requests";

export const metadata = {
	title: "Skills",
};

export const revalidate = 86400;

export default async function Skills({
	searchParams,
}: { searchParams: SearchParams }) {
	const skills = await getAllSkills(searchParams);
	return <SkillTable data={skills} />;
}
