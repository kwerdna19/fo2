import { api } from "~/trpc/server";

export const metadata = {
	title: "All Battlepasses",
};

export const revalidate = 86400;

export default async function BattlePasses() {
	const passes = await api.battlePass.getAllPopulated();
	return <pre>{JSON.stringify(passes, null, 2)}</pre>;
}
