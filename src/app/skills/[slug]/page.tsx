import { Pencil } from "lucide-react";
import { notFound } from "next/navigation";
import { AdminButton } from "~/components/AdminButton";
import { ItemSprite } from "~/components/ItemSprite";
import { getSkillBySlug } from "~/features/skills/requests";

interface Params {
	slug: string;
}

export async function generateMetadata({ params }: { params: Params }) {
	const skill = await getSkillBySlug(params.slug);
	if (!skill) {
		return {};
	}
	return {
		title: skill.name,
	};
}

export default async function Item({ params }: { params: Params }) {
	const skill = await getSkillBySlug(params.slug);

	if (!skill) {
		notFound();
	}

	return (
		<div>
			<div className="flex gap-x-4">
				<h2 className="text-3xl">
					{skill.name} {skill.rank}
				</h2>
				{/* <AdminButton
					size="icon"
					variant="outline"
					href={`/skills/${params.slug}/edit`}
				>
					<Pencil className="w-4 h-4" />
				</AdminButton> */}
			</div>
			<div>
				<ItemSprite size="xl" url={skill.spriteUrl} name={skill.name} />
			</div>
		</div>
	);
}
