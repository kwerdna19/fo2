import { Pencil } from "lucide-react";
import { notFound } from "next/navigation";
import { AdminButton } from "~/components/AdminButton";
import { IconSprite } from "~/components/IconSprite";
import { api } from "~/trpc/server";

interface Params {
	slug: string;
}

export async function generateMetadata({ params }: { params: Params }) {
	const skill = await api.skill.getBySlug(params);
	if (!skill) {
		return {};
	}
	return {
		title: skill.name,
	};
}

export default async function Item({ params }: { params: Params }) {
	const skill = await api.skill.getBySlug(params);

	if (!skill) {
		notFound();
	}

	return (
		<div>
			<div className="flex gap-x-4">
				<h2 className="text-3xl">
					{skill.name} {skill.rank}
				</h2>
				<AdminButton
					size="icon"
					variant="outline"
					href={`/skills/${params.slug}/edit`}
				>
					<Pencil className="w-4 h-4" />
				</AdminButton>
			</div>
			<div>
				<IconSprite size="xl" url={skill.spriteName} type="SKILL" />
			</div>
		</div>
	);
}
