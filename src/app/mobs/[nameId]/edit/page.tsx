import { Role } from "@prisma/client";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "~/components/ui/button";
import { MobForm } from "~/features/mobs/components/MobForm";

import { convertLocations } from "~/features/areas/utils";
import { MobDefinitionView } from "~/features/mobs/components/MobDefinition";
import { mobSchema } from "~/features/mobs/schemas";
import { userSatisfiesRoleOrRedirect } from "~/server/auth/roles";
import { api } from "~/trpc/server";
import { getIdFromNameId, getNameIdSlug } from "~/utils/misc";

interface Params {
	nameId: string;
}

export async function generateMetadata({ params }: { params: Params }) {
	const mob = await api.mob.getById(getIdFromNameId(params.nameId));
	if (!mob) {
		return {};
	}
	return {
		title: `Edit ${mob.name}`,
	};
}

export default async function EditMob({ params }: { params: Params }) {
	await userSatisfiesRoleOrRedirect(Role.MODERATOR, `/mobs/${params.nameId}`);

	const mob = await api.mob.getById(getIdFromNameId(params.nameId));

	if (!mob) {
		return notFound();
	}

	return (
		<div className="space-y-8">
			<Button size="sm" variant="outline" asChild>
				<Link href={`/mobs/${getNameIdSlug(mob)}`}>
					<ChevronLeft className="mr-2 h-4 w-4" />
					Back to page
				</Link>
			</Button>
			<MobDefinitionView mob={mob} />
			<div>
				<div className="text-lg pb-3">Extra Info</div>
				<MobForm
					defaultValue={mobSchema.parse(convertLocations(mob))}
					id={mob.id}
				/>
			</div>
		</div>
	);
}
