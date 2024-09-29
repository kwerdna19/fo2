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
import {
	getIdFromNameId,
	getNameIdSlug,
	recursivelyNullifyUndefinedValues,
} from "~/utils/misc";

interface Params {
	nameId: string;
}

export async function generateMetadata({ params }: { params: Params }) {
	const pass = await api.battlePass.getById(getIdFromNameId(params.nameId));
	if (!pass) {
		return {};
	}
	return {
		title: `Edit ${pass.item.name}`,
	};
}

export default async function EditBattlePass({ params }: { params: Params }) {
	await userSatisfiesRoleOrRedirect(
		Role.MODERATOR,
		`/battlepass/${params.nameId}`,
	);

	const pass = await api.battlePass.getById(getIdFromNameId(params.nameId));

	if (!pass) {
		return notFound();
	}

	return (
		<div className="w-full max-w-screen-xl">
			<Button size="sm" variant="outline" className="mb-5" asChild>
				<Link href={`/battlepass/${getNameIdSlug(pass.item)}`}>
					<ChevronLeft className="mr-2 h-4 w-4" />
					Back to page
				</Link>
			</Button>
			<BattlePassForm defaultValue={battlePassSchema.parse(pass)} />
		</div>
	);
}
