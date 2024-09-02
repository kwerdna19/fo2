import { Role } from "@prisma/client";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Button } from "~/components/ui/button";
import { getListOfImages } from "~/utils/server";

import { parseWithZod } from "@conform-to/zod";
import { revalidatePath } from "next/cache";
import { NpcForm } from "~/features/npcs/components/NpcForm";
import { npcSchema } from "~/features/npcs/schemas";
import { userSatisfiesRoleOrRedirect } from "~/server/auth/roles";
import { api } from "~/trpc/server";
import type { ConformResult } from "~/types/actions";

export function generateMetadata() {
	return {
		title: "Add Npc",
	};
}

export default async function AddNpc() {
	await userSatisfiesRoleOrRedirect(Role.MODERATOR, "/npcs");

	const areas = await api.area.getAllQuick();
	const items = await api.item.getAllQuick();
	const sprites = getListOfImages("npc");

	if (!sprites) {
		notFound();
	}

	async function action(result: ConformResult, formData: FormData) {
		"use server";
		const submission = parseWithZod(formData, {
			schema: npcSchema,
		});

		if (submission.status !== "success") {
			return submission.reply();
		}

		try {
			const created = await api.npc.create(submission.value);

			revalidatePath("/items", "page");
			revalidatePath("/areas", "page");
			revalidatePath("/npcs", "page");

			redirect(`/npcs/${created.slug}`);
		} catch (e) {
			return submission.reply({
				formErrors: ["Server error"],
			});
		}
	}

	return (
		<div className="w-full max-w-screen-xl">
			<Button size="sm" variant="outline" className="mb-5" asChild>
				<Link href="/npcs">
					<ChevronLeft className="mr-2 h-4 w-4" />
					Back to npcs
				</Link>
			</Button>
			<NpcForm action={action} areas={areas} items={items} sprites={sprites} />
		</div>
	);
}
