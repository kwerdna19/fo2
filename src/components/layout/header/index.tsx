import { getAllAreasQuick } from "~/features/areas/requests";
import { Header as ClientHeader } from "./Header";

export async function Header(props: { className?: string }) {
	const areas = await getAllAreasQuick();
	return <ClientHeader areas={areas} {...props} />;
}
