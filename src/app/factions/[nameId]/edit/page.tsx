import { Role } from "@prisma/client";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "~/components/ui/button";
import { FactionForm } from "~/features/factions/components/FactionForm";
import { factionSchema } from "~/features/factions/schemas";
import { userSatisfiesRoleOrRedirect } from "~/server/auth/roles";
import { api } from "~/trpc/server";
import { getIdFromNameId, getNameIdSlug } from "~/utils/misc";

interface Params {
	nameId: string;
}

export async function generateMetadata({ params }: { params: Params }) {
	const data = await api.faction.getById(getIdFromNameId(params.nameId));
	if (!data) {
		return {};
	}
	return {
		title: `Edit ${data.name}`,
	};
}

export default async function EditFaction({ params }: { params: Params }) {
	await userSatisfiesRoleOrRedirect(
		Role.MODERATOR,
		`/factions/${params.nameId}`,
	);

	const data = await api.faction.getById(getIdFromNameId(params.nameId));
	if (!data) {
		return notFound();
	}

	return (
		<div className="space-y-8">
			<Button size="sm" variant="outline" asChild>
				<Link href={`/factions/${getNameIdSlug(data)}`}>
					<ChevronLeft className="mr-2 h-4 w-4" />
					Back to page
				</Link>
			</Button>

			<FactionForm defaultValue={factionSchema.parse(data)} id={data.id} />
		</div>
	);
}
