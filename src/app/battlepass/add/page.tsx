import { Role } from "@prisma/client";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";

import { BattlePassForm } from "~/features/battlepasses/components/BattlePassForm";
import { userSatisfiesRoleOrRedirect } from "~/server/auth/roles";

export function generateMetadata() {
	return {
		title: "Add Battlepass",
	};
}

export default async function AddBattlePass() {
	await userSatisfiesRoleOrRedirect(Role.MODERATOR, "/battlepass/all");

	return (
		<div className="w-full max-w-screen-xl">
			<Button size="sm" variant="outline" className="mb-5" asChild>
				<Link href="/battlepass/all">
					<ChevronLeft className="mr-2 h-4 w-4" />
					Back to passes
				</Link>
			</Button>
			<BattlePassForm />
		</div>
	);
}
