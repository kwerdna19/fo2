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
import { recursivelyNullifyUndefinedValues } from "~/utils/misc";

interface Params {
	slug: string;
}

export async function generateMetadata({ params }: { params: Params }) {
	const npc = await api.npc.getBySlug(params);
	if (!npc) {
		return {};
	}
	return {
		title: `Edit ${npc.name}`,
	};
}

export default async function EditNpc({ params }: { params: Params }) {
	await userSatisfiesRoleOrRedirect(Role.MODERATOR, `/npcs/${params.slug}`);

	const npc = await api.npc.getBySlug(params);

	if (!npc) {
		return notFound();
	}

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

		if (submission.status !== "success" || !npc) {
			return submission.reply();
		}

		let redirectUrl: undefined | string;

		try {
			const converted = recursivelyNullifyUndefinedValues(submission.value);
			const updated = await api.npc.update({
				id: npc.id,
				data: converted,
			});
			if (updated.slug !== npc.slug) {
				redirectUrl = updated.slug;
			}
		} catch (e) {
			console.error(e);
			return submission.reply({
				formErrors: ["Server error"],
			});
		}

		revalidatePath("/npcs", "page");
		revalidatePath("/items", "page");
		revalidatePath("/areas", "page");

		if (redirectUrl) {
			redirect(redirectUrl);
		}

		return submission.reply();
	}

	return (
		<div className="w-full max-w-screen-xl">
			<Button size="sm" variant="outline" className="mb-5" asChild>
				<Link href={`/npcs/${npc.slug}`}>
					<ChevronLeft className="mr-2 h-4 w-4" />
					Back to page
				</Link>
			</Button>
			<NpcForm
				action={action}
				areas={areas}
				items={items}
				sprites={sprites}
				defaultValue={npc}
			/>
		</div>
	);
}
