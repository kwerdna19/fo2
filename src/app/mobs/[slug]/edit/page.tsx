import { Role } from "@prisma/client";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Button } from "~/components/ui/button";
import { MobForm } from "~/features/mobs/components/MobForm";
import { getListOfImages } from "~/utils/server";

import { parseWithZod } from "@conform-to/zod";
import { revalidatePath } from "next/cache";
import { getAllAreasQuick } from "~/features/areas/requests";
import { getAllItemsQuick } from "~/features/items/requests";
import { getMobBySlug, updateMob } from "~/features/mobs/requests";
import { mobSchema } from "~/features/mobs/schemas";
import { userSatisfiesRoleOrRedirect } from "~/server/auth/roles";
import { type ConformResult } from "~/types/actions";
import { recursivelyNullifyUndefinedValues } from "~/utils/misc";

interface Params {
	slug: string;
}

export async function generateMetadata({ params }: { params: Params }) {
	const mob = await getMobBySlug(params.slug);
	if (!mob) {
		return {};
	}
	return {
		title: `Edit ${mob.name}`,
	};
}

export default async function EditMob({ params }: { params: Params }) {
	await userSatisfiesRoleOrRedirect(Role.MODERATOR, `/mobs/${params.slug}`);

	const mob = await getMobBySlug(params.slug);

	if (!mob) {
		return notFound();
	}

	const areas = await getAllAreasQuick();
	const items = await getAllItemsQuick();
	const sprites = getListOfImages("mob");

	if (!sprites) {
		notFound();
	}

	async function action(result: ConformResult, formData: FormData) {
		"use server";
		const submission = parseWithZod(formData, {
			schema: mobSchema,
		});

		if (submission.status !== "success" || !mob) {
			return submission.reply();
		}

		try {
			const converted = recursivelyNullifyUndefinedValues(submission.value);
			const updated = await updateMob(mob.id, converted);

			revalidatePath("/mobs", "page");
			revalidatePath("/items", "page");
			revalidatePath("/areas", "page");

			if (updated.slug !== mob.slug) {
				redirect(`/mobs/${updated.slug}/edit`);
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
				<Link href={`/mobs/${mob.slug}`}>
					<ChevronLeft className="mr-2 h-4 w-4" />
					Back to page
				</Link>
			</Button>
			<MobForm
				action={action}
				areas={areas}
				items={items}
				sprites={sprites}
				defaultValue={mob}
			/>
		</div>
	);
}
