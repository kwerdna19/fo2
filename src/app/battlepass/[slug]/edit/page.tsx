import { Role } from "@prisma/client";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Button } from "~/components/ui/button";

import { parseWithZod } from "@conform-to/zod";
import { revalidatePath } from "next/cache";
import { BattlePassForm } from "~/features/battlepasses/components/BattlePassForm";

import { battlePassSchema } from "~/features/battlepasses/schemas";
import { userSatisfiesRoleOrRedirect } from "~/server/auth/roles";
import { api } from "~/trpc/server";
import type { ConformResult } from "~/types/actions";
import { recursivelyNullifyUndefinedValues } from "~/utils/misc";

interface Params {
	slug: string;
}

export async function generateMetadata({ params }: { params: Params }) {
	const pass = await api.battlePass.getBySlug(params);
	if (!pass) {
		return {};
	}
	return {
		title: `Edit ${pass.name}`,
	};
}

export default async function EditBattlePass({ params }: { params: Params }) {
	await userSatisfiesRoleOrRedirect(
		Role.MODERATOR,
		`/battlepass/${params.slug}`,
	);

	const pass = await api.battlePass.getBySlug(params);

	if (!pass) {
		return notFound();
	}

	const items = await api.item.getAllQuick();

	async function action(result: ConformResult, formData: FormData) {
		"use server";
		const submission = parseWithZod(formData, {
			schema: battlePassSchema,
		});

		if (submission.status !== "success" || !pass) {
			return submission.reply();
		}

		try {
			const converted = recursivelyNullifyUndefinedValues(submission.value);
			const updated = await api.battlePass.update({
				id: pass.id,
				data: converted,
			});

			revalidatePath("/items", "page");
			revalidatePath("/battlepass/all", "page");
			revalidatePath(`/battlepass/${updated.slug}`);
			// revalidatePath('/battlepass', 'page')

			if (updated.slug !== pass.slug) {
				redirect(`/battlepass/${updated.slug}/edit`);
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
				<Link href={`/battlepass/${pass.slug}`}>
					<ChevronLeft className="mr-2 h-4 w-4" />
					Back to page
				</Link>
			</Button>
			<BattlePassForm defaultValue={battlePassSchema.parse(pass)} />
		</div>
	);
}
