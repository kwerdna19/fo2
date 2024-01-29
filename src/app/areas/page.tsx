import dynamic from "next/dynamic";
import { getAllAreasPopulated } from "~/features/areas/requests";

const MultiAreaMap = dynamic(
	() => import("~/features/areas/components/MultiAreaMap"),
	{ ssr: false },
);

export const metadata = {
	title: "Areas",
};

export default async function Areas() {
	const areas = await getAllAreasPopulated();

	return (
		<div className="w-full flex flex-col items-center gap-y-6">
			<h2 className="text-3xl">World Map</h2>
			<MultiAreaMap areas={areas} bg="#1F4A57" />
		</div>
	);
}
