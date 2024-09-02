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
import { recursivelyNullifyUndefinedValues } from "~/utils/misc";
import { getListOfImages } from "~/utils/server";

interface Params {
	slug: string;
}

export async function generateMetadata({ params }: { params: Params }) {
	const item = await api.item.getBySlug(params);
	if (!item) {
		return {};
	}
	return {
		title: `Edit ${item.name}`,
	};
}

export default async function EditItem({ params }: { params: Params }) {
	await userSatisfiesRoleOrRedirect(Role.MODERATOR, `/items/${params.slug}`);

	const item = await api.item.getBySlug(params);

	if (!item) {
		return notFound();
	}

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

		if (submission.status !== "success" || !item) {
			return submission.reply();
		}

		try {
			const converted = recursivelyNullifyUndefinedValues(submission.value);
			const updated = await api.item.update({
				id: item.id,
				data: converted,
			});

			revalidatePath("/mobs", "page");
			revalidatePath("/items", "page");
			revalidatePath("/areas", "page");
			revalidatePath("/npcs", "page");

			if (updated.slug !== item.slug) {
				redirect(`/items/${updated.slug}/edit`);
			}

			return submission.reply();
		} catch (e) {
			return submission.reply({
				formErrors: ["Server error"],
			});
		}
	}

	// TODO - figure out
	// const action = createConformAction(itemSchema, async (input) => {

	//   const updated = await updateItem(item.id, input)

	//   revalidatePath('/mobs', 'page')
	//   revalidatePath('/items', 'page')
	//   revalidatePath('/areas', 'page')
	//   revalidatePath('/npcs', 'page')

	//   if(updated.slug !== item.slug) {
	//     redirect(`/items/${updated.slug}/edit`)
	//   }

	// })

	return (
		<div className="w-full max-w-screen-xl">
			<Button size="sm" variant="outline" className="mb-5" asChild>
				<Link href={`/items/${item.slug}`}>
					<ChevronLeft className="mr-2 h-4 w-4" />
					Back to page
				</Link>
			</Button>
			<ItemForm
				action={action}
				sprites={sprites}
				defaultValue={item}
				mobs={mobs}
				npcs={npcs}
				battlePasses={battlePasses}
			/>
		</div>
	);
}
