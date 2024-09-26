import { ChevronLeft, Pencil } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminButton } from "~/components/AdminButton";
import { Sprite } from "~/components/Sprite";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/server";

interface Params {
	nameId: string;
}

export async function generateMetadata({ params }: { params: Params }) {
	const data = await api.faction.getById(params);
	if (!data) {
		return {};
	}
	return {
		title: data.name,
	};
}

export default async function Faction({ params }: { params: Params }) {
	const data = await api.faction.getById(params);

	if (!data) {
		notFound();
	}

	return (
		<div className="space-y-8">
			<Button size="sm" variant="outline" asChild>
				<Link href="/factions">
					<ChevronLeft className="mr-2 h-4 w-4" />
					Factions
				</Link>
			</Button>
			<div className="flex gap-x-4">
				<h2 className="text-3xl">{data.name}</h2>
				<AdminButton
					size="icon"
					variant="outline"
					href={`/factions/${params.nameId}/edit`}
				>
					<Pencil className="w-4 h-4" />
				</AdminButton>
			</div>

			<div>
				<div>Example Mobs:</div>
				<div className="flex flex-wrap gap-x-4 gap-y-2">
					{data.mobs.map((mob) => (
						<Sprite key={mob.id} type="MOB" url={mob.spriteName} size="sm" />
					))}
				</div>
			</div>
		</div>
	);
}
