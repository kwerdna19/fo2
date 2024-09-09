import { Role } from "@prisma/client";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { userSatisfiesRoleOrRedirect } from "~/server/auth/roles";

export function generateMetadata() {
	return {
		title: "Add Item",
	};
}

export default async function AddItem() {
	await userSatisfiesRoleOrRedirect(Role.MODERATOR, "/items");

	return (
		<div className="w-full max-w-screen-xl">
			<Button size="sm" variant="outline" className="mb-5" asChild>
				<Link href="/items">
					<ChevronLeft className="mr-2 h-4 w-4" />
					Back to items
				</Link>
			</Button>
			{/* <ItemForm /> */}
		</div>
	);
}
