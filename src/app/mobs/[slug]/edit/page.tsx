import { Role } from "@prisma/client";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Button } from "~/components/ui/button";
import { MobForm } from "~/features/mobs/components/MobForm";
import { getListOfImages } from "~/utils/server";

import { parseWithZod } from "@conform-to/zod";
import { revalidatePath } from "next/cache";
import { mobSchema } from "~/features/mobs/schemas";
import { userSatisfiesRoleOrRedirect } from "~/server/auth/roles";
import { api } from "~/trpc/server";
import type { ConformResult } from "~/types/actions";
import { recursivelyNullifyUndefinedValues } from "~/utils/misc";

interface Params {
	slug: string;
}

export async function generateMetadata({ params }: { params: Params }) {
	const mob = await api.mob.getBySlug(params);
	if (!mob) {
		return {};
	}
	return {
		title: `Edit ${mob.name}`,
	};
}

export default async function EditMob({ params }: { params: Params }) {
	await userSatisfiesRoleOrRedirect(Role.MODERATOR, `/mobs/${params.slug}`);

	const mob = await api.mob.getBySlug(params);

	if (!mob) {
		return notFound();
	}

	const areas = await api.area.getAllQuick();
	const items = await api.item.getAllQuick();
	const factions = await api.faction.getAllQuick();

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
			const updated = await api.mob.update({
				id: mob.id,
				data: converted,
			});

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
				factions={factions}
				defaultValue={mob}
			/>
		</div>
	);
}
