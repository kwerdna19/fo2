import { Role } from "@prisma/client";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";

import { userSatisfiesRoleOrRedirect } from "~/server/auth/roles";

export function generateMetadata() {
	return {
		title: "Add Faction",
	};
}

export default async function AddMob() {
	await userSatisfiesRoleOrRedirect(Role.MODERATOR, "/factions");

	return (
		<div className="w-full max-w-screen-xl space-y-8">
			<Button size="sm" variant="outline" className="mb-5" asChild>
				<Link href="/factions">
					<ChevronLeft className="mr-2 h-4 w-4" />
					Factions
				</Link>
			</Button>
			<p className="max-w-prose">
				Adding factions is not supported. New factions are auto-created with the
				name "Unknown Faction" when new mobs are scraped from the data API and
				then can be updated afterwards.
			</p>
		</div>
	);
}
