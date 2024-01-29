import { getAllAreasQuick } from "~/features/areas/requests";
import { Header as ClientHeader } from "./Header";

export async function Header() {
	const areas = await getAllAreasQuick();
	return <ClientHeader areas={areas} />;
}
