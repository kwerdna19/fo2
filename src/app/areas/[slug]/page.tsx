import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import { api } from "~/trpc/server";

const SingleAreaMap = dynamic(
	() => import("~/features/areas/components/SingleAreaMap"),
	{ ssr: false },
);

interface Params {
	slug: string;
}

export async function generateMetadata({ params }: { params: Params }) {
	const area = await api.area.getBySlug(params);
	if (!area) {
		return {};
	}
	return {
		title: area.name,
	};
}

export async function generateStaticParams() {
	const areas = await api.area.getAllQuick();
	return areas.map((area) => ({
		slug: area.slug,
	}));
}

export default async function Area({ params }: { params: Params }) {
	const area = await api.area.getBySlug(params);

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
