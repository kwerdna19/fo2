import { Role } from "@prisma/client";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";

import { userSatisfiesRoleOrRedirect } from "~/server/auth/roles";

export function generateMetadata() {
	return {
		title: "Add Mob",
	};
}

export default async function AddMob() {
	await userSatisfiesRoleOrRedirect(Role.MODERATOR, "/mobs");

	return (
		<div className="w-full max-w-screen-xl">
			<Button size="sm" variant="outline" className="mb-5" asChild>
				<Link href="/mobs">
					<ChevronLeft className="mr-2 h-4 w-4" />
					Back to mobs
				</Link>
			</Button>
			{/* <MobForm /> */}
		</div>
	);
}
