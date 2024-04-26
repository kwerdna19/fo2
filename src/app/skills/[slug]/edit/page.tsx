import { parseWithZod } from "@conform-to/zod";
import { Role } from "@prisma/client";
import { ChevronLeft } from "lucide-react";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Button } from "~/components/ui/button";
import { getAllAreasQuick } from "~/features/areas/requests";
import { getAllItemsQuick } from "~/features/items/requests";
import { SkillForm } from "~/features/skills/components/SkillForm";
import { getSkillBySlug, updateSkill } from "~/features/skills/requests";
import { skillSchema } from "~/features/skills/schemas";
import { userSatisfiesRoleOrRedirect } from "~/server/auth/roles";
import type { ConformResult } from "~/types/actions";
import { recursivelyNullifyUndefinedValues } from "~/utils/misc";
import { getListOfImages } from "~/utils/server";

interface Params {
	slug: string;
}

export async function generateMetadata({ params }: { params: Params }) {
	const skill = await getSkillBySlug(params.slug);
	if (!skill) {
		return {};
	}
	return {
		title: `Edit ${skill.name}`,
	};
}

export default async function EditSkill({ params }: { params: Params }) {
	await userSatisfiesRoleOrRedirect(Role.MODERATOR, `/skills/${params.slug}`);

	const skill = await getSkillBySlug(params.slug);

	if (!skill) {
		return notFound();
	}

	const items = await getAllItemsQuick();
	const areas = await getAllAreasQuick();
	const sprites = getListOfImages("skill");

	if (!sprites) {
		notFound();
	}

	async function action(result: ConformResult, formData: FormData) {
		"use server";
		const submission = parseWithZod(formData, {
			schema: skillSchema,
		});

		if (submission.status !== "success" || !skill) {
			return submission.reply();
		}

		try {
			const converted = recursivelyNullifyUndefinedValues(submission.value);
			const updated = await updateSkill(skill.id, converted);

			revalidatePath("/skills", "page");
			revalidatePath("/items", "page");

			if (updated.slug !== skill.slug) {
				redirect(`/skills/${updated.slug}/edit`);
			}

			return submission.reply();
		} catch (e) {
			return submission.reply({
				formErrors: ["Server error"],
			});
		}
	}

	return (
		<div className="w-full max-w-screen-xl">
			<Button size="sm" variant="outline" className="mb-5" asChild>
				<Link href={`/skills/${skill.slug}`}>
					<ChevronLeft className="mr-2 h-4 w-4" />
					Back to page
				</Link>
			</Button>
			<SkillForm
				action={action}
				sprites={sprites}
				defaultValue={skill}
				items={items}
				areas={areas}
			/>
		</div>
	);
}
