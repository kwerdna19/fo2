import { Pencil } from "lucide-react";
import { notFound } from "next/navigation";
import { AdminButton } from "~/components/AdminButton";
import { Sprite } from "~/components/Sprite";
import { api } from "~/trpc/server";

interface Params {
	slug: string;
}

export async function generateMetadata({ params }: { params: Params }) {
	const mob = await api.mob.getBySlug(params);
	if (!mob) {
		return {};
	}
	return {
		title: mob.name,
	};
}

export default async function Mob({ params }: { params: Params }) {
	const mob = await api.mob.getBySlug(params);

	if (!mob) {
		notFound();
	}

	return (
		<div>
			<div className="flex gap-x-4">
				<h2 className="text-3xl">{mob.name}</h2>
				<AdminButton
					size="icon"
					variant="outline"
					href={`/mobs/${params.slug}/edit`}
				>
					<Pencil className="w-4 h-4" />
				</AdminButton>
			</div>
			<div>
				<Sprite type="MOB" size="lg" url={mob.spriteName} animated />
			</div>
		</div>
	);
}
