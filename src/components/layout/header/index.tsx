import { auth } from "~/server/auth/auth";
import { anonApi } from "~/trpc/server";
import { Header as ClientHeader } from "./Header";

export async function Header(props: { className?: string }) {
	const areas = await anonApi.area.getAllQuick();
	const session = await auth();

	return <ClientHeader areas={areas} user={session?.user} {...props} />;
}
