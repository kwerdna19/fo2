import { parseWithZod } from "@conform-to/zod";
import { Role } from "@prisma/client";
import { ChevronLeft } from "lucide-react";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { RedirectType, notFound, redirect } from "next/navigation";
import { Button } from "~/components/ui/button";
import { getAllAreasQuick } from "~/features/areas/requests";
import { getAllItemsQuick } from "~/features/items/requests";
import { SkillForm } from "~/features/skills/components/SkillForm";
import { createSkill } from "~/features/skills/requests";
import { skillSchema } from "~/features/skills/schemas";
import { userSatisfiesRoleOrRedirect } from "~/server/auth/roles";
import { type ConformResult } from "~/types/actions";
import { getListOfImages } from "~/utils/server";

export function generateMetadata() {
	return {
		title: "Add Skill",
	};
}

export default async function AddSkill() {
	await userSatisfiesRoleOrRedirect(Role.MODERATOR, "/skills");

	const areas = await getAllAreasQuick()
	const items = await getAllItemsQuick();
	const sprites = getListOfImages("skill");

	if (!sprites) {
		notFound();
	}

	async function action(result: ConformResult, formData: FormData) {
		"use server";
		const submission = parseWithZod(formData, {
			schema: skillSchema,
		});

		if (submission.status !== "success") {
			return submission.reply();
		}

		let redirectUrl: undefined | string

		try {
			const created = await createSkill(submission.value);
			redirectUrl = `/skills/${created.slug}`
		} catch (e) {
			console.log(e)
			return submission.reply({
				formErrors: ["Server error"],
			});
		}

		revalidatePath("/skills", "page");
		revalidatePath("/items", "page");
		if(redirectUrl) {
			redirect(redirectUrl);
		}
		notFound()

	}

	return (
		<div className="w-full max-w-screen-xl">
			<Button size="sm" variant="outline" className="mb-5" asChild>
				<Link href="/skills">
					<ChevronLeft className="mr-2 h-4 w-4" />
					Back to skills
				</Link>
			</Button>
			<SkillForm action={action} sprites={sprites} items={items} areas={areas} />
		</div>
	);
}
