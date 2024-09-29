import { Role } from "@prisma/client";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "~/components/ui/button";
import { SkillForm } from "~/features/skills/components/SkillForm";
import { skillSchema } from "~/features/skills/schemas";
import { getSkillNameIdSlug } from "~/features/skills/utils";
import { userSatisfiesRoleOrRedirect } from "~/server/auth/roles";
import { api } from "~/trpc/server";
import { getIdFromNameId } from "~/utils/misc";

interface Params {
	nameId: string;
}

export async function generateMetadata({ params }: { params: Params }) {
	const skill = await api.skill.getById(getIdFromNameId(params.nameId));
	if (!skill) {
		return {};
	}
	return {
		title: `Edit ${skill.name}`,
	};
}

export default async function EditSkill({ params }: { params: Params }) {
	await userSatisfiesRoleOrRedirect(Role.MODERATOR, `/skills/${params.nameId}`);

	const skill = await api.skill.getById(getIdFromNameId(params.nameId));

	if (!skill) {
		return notFound();
	}

	return (
		<div className="w-full max-w-screen-xl">
			<Button size="sm" variant="outline" className="mb-5" asChild>
				<Link href={`/skills/${getSkillNameIdSlug(skill)}`}>
					<ChevronLeft className="mr-2 h-4 w-4" />
					Back to page
				</Link>
			</Button>
			<SkillForm id={skill.id} defaultValue={skillSchema.parse(skill)} />
		</div>
	);
}
