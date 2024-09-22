import { parseWithZod } from "@conform-to/zod";
import { Role } from "@prisma/client";
import { ChevronLeft } from "lucide-react";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Button } from "~/components/ui/button";
import { SkillForm } from "~/features/skills/components/SkillForm";
import { skillSchema } from "~/features/skills/schemas";
import { userSatisfiesRoleOrRedirect } from "~/server/auth/roles";
import { api } from "~/trpc/server";
import type { ConformResult } from "~/types/actions";
import { recursivelyNullifyUndefinedValues } from "~/utils/misc";
import { getListOfImages } from "~/utils/server";

interface Params {
	slug: string;
}

export async function generateMetadata({ params }: { params: Params }) {
	const skill = await api.skill.getBySlug(params);
	if (!skill) {
		return {};
	}
	return {
		title: `Edit ${skill.name}`,
	};
}

export default async function EditSkill({ params }: { params: Params }) {
	await userSatisfiesRoleOrRedirect(Role.MODERATOR, `/skills/${params.slug}`);

	const skill = await api.skill.getBySlug(params);

	if (!skill) {
		return notFound();
	}

	return (
		<div className="w-full max-w-screen-xl">
			<Button size="sm" variant="outline" className="mb-5" asChild>
				<Link href={`/skills/${skill.slug}`}>
					<ChevronLeft className="mr-2 h-4 w-4" />
					Back to page
				</Link>
			</Button>
			<SkillForm id={skill.id} defaultValue={skillSchema.parse(skill)} />
		</div>
	);
}
