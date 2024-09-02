import { api } from "~/trpc/server";
import { Header as ClientHeader } from "./Header";

export async function Header(props: { className?: string }) {
	const areas = await api.area.getAllQuick();
	return <ClientHeader areas={areas} {...props} />;
}
