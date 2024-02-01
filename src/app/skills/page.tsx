import { SkillTable } from "~/features/skills/components/SkillsTable";
import { getAllSkills } from "~/features/skills/requests";

export const metadata = {
	title: "Skills",
};

export const revalidate = 86400;

export default async function Skills() {
	const skills = await getAllSkills();
	return <SkillTable data={skills} />
}
