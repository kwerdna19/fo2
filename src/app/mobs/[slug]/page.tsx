import { Pencil } from "lucide-react";
import { notFound } from "next/navigation";
import { AdminButton } from "~/components/AdminButton";
import { MobSprite } from "~/components/MobSprite";
import { getMobBySlug } from "~/features/mobs/requests";

interface Params {
	slug: string;
}

export async function generateMetadata({ params }: { params: Params }) {
	const mob = await getMobBySlug(params.slug);
	if (!mob) {
		return {};
	}
	return {
		title: mob.name,
	};
}

export default async function Mob({ params }: { params: Params }) {
	const mob = await getMobBySlug(params.slug);

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
				<MobSprite size="xl" url={mob.spriteUrl} name={mob.name} />
			</div>
		</div>
	);
}
