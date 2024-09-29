import { notFound, redirect } from "next/navigation";
import { api } from "~/trpc/server";
import { getNameIdSlug } from "~/utils/misc";

export const metadata = {
	title: "Battlepass",
};

export default async function BattlePass() {
	const pass =
		(await api.battlePass.getCurrent()) ?? (await api.battlePass.getNext());

	if (!pass) {
		notFound();
	}
	redirect(`/battlepass/${getNameIdSlug(pass.item)}`);
}
