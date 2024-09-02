import { parseWithZod } from "@conform-to/zod";
import { Role } from "@prisma/client";
import { ChevronLeft } from "lucide-react";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Button } from "~/components/ui/button";
import { ItemForm } from "~/features/items/components/ItemForm";
import { itemSchema } from "~/features/items/schemas";
import { userSatisfiesRoleOrRedirect } from "~/server/auth/roles";
import { api } from "~/trpc/server";
import type { ConformResult } from "~/types/actions";
import { getListOfImages } from "~/utils/server";

export function generateMetadata() {
	return {
		title: "Add Item",
	};
}

export default async function AddItem() {
	await userSatisfiesRoleOrRedirect(Role.MODERATOR, "/items");

	const mobs = await api.mob.getAllQuick();
	const npcs = await api.npc.getAllQuick();
	const battlePasses = await api.battlePass.getAllQuick();

	const sprites = getListOfImages("item");

	if (!sprites) {
		notFound();
	}

	async function action(result: ConformResult, formData: FormData) {
		"use server";
		const submission = parseWithZod(formData, {
			schema: itemSchema,
		});

		if (submission.status !== "success") {
			return submission.reply();
		}

		try {
			const created = await api.item.create(submission.value);

			revalidatePath("/mobs", "page");
			revalidatePath("/items", "page");
			revalidatePath("/areas", "page");
			revalidatePath("/npcs", "page");

			redirect(`/items/${created.slug}`);
		} catch (e) {
			return submission.reply({
				formErrors: ["Server error"],
			});
		}
	}

	return (
		<div className="w-full max-w-screen-xl">
			<Button size="sm" variant="outline" className="mb-5" asChild>
				<Link href="/items">
					<ChevronLeft className="mr-2 h-4 w-4" />
					Back to items
				</Link>
			</Button>
			<ItemForm
				action={action}
				sprites={sprites}
				mobs={mobs}
				npcs={npcs}
				battlePasses={battlePasses}
			/>
		</div>
	);
}
