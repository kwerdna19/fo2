import { Pencil } from "lucide-react";
import { notFound } from "next/navigation";
import { AdminButton } from "~/components/AdminButton";
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
		<div>
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
			<div className="whitespace-pre">{JSON.stringify(data, null, 2)}</div>
		</div>
	);
}
