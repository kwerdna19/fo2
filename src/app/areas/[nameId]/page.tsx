import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import { anonApi } from "~/trpc/server";
import { getIdFromNameId, getNameIdSlug, getSlugFromName } from "~/utils/misc";

const SingleAreaMap = dynamic(
	() => import("~/features/areas/components/SingleAreaMap"),
	{ ssr: false },
);

interface Params {
	nameId: string;
}

export async function generateMetadata({ params }: { params: Params }) {
	const area = await anonApi.area.getById(getIdFromNameId(params.nameId));
	if (!area) {
		return {};
	}
	return {
		title: area.name,
	};
}

export async function generateStaticParams() {
	const areas = await anonApi.area.getAll();
	return areas.map((area) => {
		return {
			nameId: getNameIdSlug(area),
		};
	});
}

export default async function Area({ params }: { params: Params }) {
	const area = await anonApi.area.getById(getIdFromNameId(params.nameId));

	if (!area) {
		notFound();
	}

	return (
		<div className="w-full flex flex-col items-center gap-y-8">
			<h2 className="text-3xl">{area.name}</h2>
			<SingleAreaMap area={area} />
		</div>
	);
}
