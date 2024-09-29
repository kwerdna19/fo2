import { Role } from "@prisma/client";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "~/components/ui/button";
import { ItemDefinitionView } from "~/features/items/components/ItemDefinition";
import { ItemForm } from "~/features/items/components/ItemForm";
import { itemSchema } from "~/features/items/schemas";
import { userSatisfiesRoleOrRedirect } from "~/server/auth/roles";
import { api } from "~/trpc/server";
import { getIdFromNameId, getNameIdSlug } from "~/utils/misc";

interface Params {
	nameId: string;
}

export async function generateMetadata({ params }: { params: Params }) {
	const item = await api.item.getById(getIdFromNameId(params.nameId));
	if (!item) {
		return {};
	}
	return {
		title: `Edit ${item.name}`,
	};
}

export default async function EditItem({ params }: { params: Params }) {
	await userSatisfiesRoleOrRedirect(Role.MODERATOR, `/items/${params.nameId}`);

	const item = await api.item.getById(getIdFromNameId(params.nameId));

	if (!item) {
		return notFound();
	}

	return (
		<div className="space-y-8">
			<Button size="sm" variant="outline" asChild>
				<Link href={`/items/${getNameIdSlug(item)}`}>
					<ChevronLeft className="mr-2 h-4 w-4" />
					Back to page
				</Link>
			</Button>
			<ItemDefinitionView item={item} />

			<div>
				<div className="text-lg pb-3">Extra Info</div>
				<ItemForm defaultValue={itemSchema.parse(item)} id={item.id} />
			</div>
		</div>
	);
}
