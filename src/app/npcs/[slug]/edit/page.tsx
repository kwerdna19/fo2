import { Role } from "@prisma/client";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Button } from "~/components/ui/button";
import { getListOfImages } from "~/utils/server";

import { parseWithZod } from "@conform-to/zod";
import { revalidatePath } from "next/cache";
import { convertLocations } from "~/features/areas/utils";
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
	return (
		<div className="w-full max-w-screen-xl">
			<Button size="sm" variant="outline" className="mb-5" asChild>
				<Link href={`/npcs/${npc.slug}`}>
					<ChevronLeft className="mr-2 h-4 w-4" />
					Back to page
				</Link>
			</Button>
			<NpcForm
				defaultValue={npcSchema.parse(convertLocations(npc))}
				id={npc.id}
			/>
		</div>
	);
}
