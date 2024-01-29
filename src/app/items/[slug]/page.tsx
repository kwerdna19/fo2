import { Pencil } from "lucide-react";
import { notFound } from "next/navigation";
import { AdminButton } from "~/components/AdminButton";
import { ItemSprite } from "~/components/ItemSprite";
import { getItemBySlug } from "~/features/items/requests";

interface Params {
	slug: string;
}

export async function generateMetadata({ params }: { params: Params }) {
	const item = await getItemBySlug(params.slug);
	if (!item) {
		return {};
	}
	return {
		title: item.name,
	};
}

export default async function Item({ params }: { params: Params }) {
	const item = await getItemBySlug(params.slug);

	if (!item) {
		notFound();
	}

	return (
		<div>
			<div className="flex gap-x-4">
				<h2 className="text-3xl">{item.name}</h2>
				<AdminButton
					size="icon"
					variant="outline"
					href={`/items/${params.slug}/edit`}
				>
					<Pencil className="w-4 h-4" />
				</AdminButton>
			</div>
			<div>
				<ItemSprite size="xl" url={item.spriteUrl} name={item.name} />
			</div>
		</div>
	);
}
