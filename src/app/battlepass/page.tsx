import { notFound, redirect } from "next/navigation";
import {
	getCurrentBattlePass,
	getNextBattlePass,
} from "~/features/battlepasses/requests";

export const metadata = {
	title: "Battlepass",
};

export default async function BattlePass() {
	const pass = (await getCurrentBattlePass()) ?? (await getNextBattlePass());

	if (!pass) {
		notFound();
	}
	redirect(`/battlepass/${pass.slug}`);
}
