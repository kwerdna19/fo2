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
import { getAllFactionsQuick } from "~/features/factions/requests";
import { getAllItemsQuick } from "~/features/items/requests";
import { createMob } from "~/features/mobs/requests";
import { mobSchema } from "~/features/mobs/schemas";
import { userSatisfiesRoleOrRedirect } from "~/server/auth/roles";
import type { ConformResult } from "~/types/actions";

export function generateMetadata() {
	return {
		title: "Add Mob",
	};
}

export default async function AddMob() {
	await userSatisfiesRoleOrRedirect(Role.MODERATOR, "/mobs");

	const areas = await getAllAreasQuick();
	const items = await getAllItemsQuick();
	const sprites = getListOfImages("mob");
	const factions = await getAllFactionsQuick();

	if (!sprites) {
		notFound();
	}

	async function action(result: ConformResult, formData: FormData) {
		"use server";
		const submission = parseWithZod(formData, {
			schema: mobSchema,
		});

		if (submission.status !== "success") {
			return submission.reply();
		}

		try {
			const created = await createMob(submission.value);

			revalidatePath("/mobs", "page");
			revalidatePath("/items", "page");
			revalidatePath("/areas", "page");

			redirect(`/mobs/${created.slug}`);
		} catch (e) {
			return submission.reply({
				formErrors: ["Server error"],
			});
		}
	}

	return (
		<div className="w-full max-w-screen-xl">
			<Button size="sm" variant="outline" className="mb-5" asChild>
				<Link href="/mobs">
					<ChevronLeft className="mr-2 h-4 w-4" />
					Back to mobs
				</Link>
			</Button>
			<MobForm
				action={action}
				areas={areas}
				items={items}
				sprites={sprites}
				factions={factions}
			/>
		</div>
	);
}
