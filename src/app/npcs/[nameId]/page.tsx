import { Pencil } from "lucide-react";
import { notFound } from "next/navigation";
import { AdminButton } from "~/components/AdminButton";
import { Sprite } from "~/components/Sprite";
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
		title: npc.name,
	};
}

export default async function Npc({ params }: { params: Params }) {
	const npc = await api.npc.getById(getIdFromNameId(params.nameId));

	if (!npc) {
		notFound();
	}

	return (
		<div>
			<div className="flex gap-x-4">
				<h2 className="text-3xl">{npc.name}</h2>
				<AdminButton
					size="icon"
					variant="outline"
					href={`/npcs/${getNameIdSlug(npc)}/edit`}
				>
					<Pencil className="w-4 h-4" />
				</AdminButton>
			</div>
			<div>
				<Sprite type="NPC" size="xl" url={npc.spriteName} />
			</div>
		</div>
	);
}
