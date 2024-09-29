import { Role } from "@prisma/client";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "~/components/ui/button";

import { convertLocations } from "~/features/areas/utils";
import { NpcForm } from "~/features/npcs/components/NpcForm";
import { npcSchema } from "~/features/npcs/schemas";
import { userSatisfiesRoleOrRedirect } from "~/server/auth/roles";
import { api } from "~/trpc/server";
import { getIdFromNameId, getNameIdSlug } from "~/utils/misc";

interface Params {
	nameId: string;
}

export async function generateMetadata({ params }: { params: Params }) {
	const npc = await api.npc.getById(getIdFromNameId(params.nameId));
	if (!npc) {
		return {};
	}
	return {
		title: `Edit ${npc.name}`,
	};
}

export default async function EditNpc({ params }: { params: Params }) {
	await userSatisfiesRoleOrRedirect(Role.MODERATOR, `/npcs/${params.nameId}`);

	const npc = await api.npc.getById(getIdFromNameId(params.nameId));

	if (!npc) {
		return notFound();
	}

	return (
		<div className="w-full max-w-screen-xl">
			<Button size="sm" variant="outline" className="mb-5" asChild>
				<Link href={`/npcs/${getNameIdSlug(npc)}`}>
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
