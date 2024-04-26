import { Role } from "@prisma/client";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";

import { parseWithZod } from "@conform-to/zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { BattlePassForm } from "~/features/battlepasses/components/BattlePassForm";
import { createBattlePass } from "~/features/battlepasses/requests";
import { battlePassSchema } from "~/features/battlepasses/schemas";
import { getAllItemsQuick } from "~/features/items/requests";
import { userSatisfiesRoleOrRedirect } from "~/server/auth/roles";
import type { ConformResult } from "~/types/actions";

export function generateMetadata() {
	return {
		title: "Add Battlepass",
	};
}

export default async function AddBattlePass() {
	await userSatisfiesRoleOrRedirect(Role.MODERATOR, "/battlepass/all");

	const items = await getAllItemsQuick();

	async function action(result: ConformResult, formData: FormData) {
		"use server";
		const submission = parseWithZod(formData, {
			schema: battlePassSchema,
		});

		if (submission.status !== "success") {
			return submission.reply();
		}

		try {
			const created = await createBattlePass(submission.value);

			revalidatePath("/items", "page");
			revalidatePath("/battlepass/all", "page");
			revalidatePath("/battlepass", "page");

			redirect(`/battlepass/${created.slug}`);
		} catch (e) {
			console.error(e);

			return submission.reply({
				formErrors: ["Server error"],
			});
		}
	}

	return (
		<div className="w-full max-w-screen-xl">
			<Button size="sm" variant="outline" className="mb-5" asChild>
				<Link href="/battlepass/all">
					<ChevronLeft className="mr-2 h-4 w-4" />
					Back to passes
				</Link>
			</Button>
			<BattlePassForm action={action} items={items} />
		</div>
	);
}
