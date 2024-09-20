import { Role } from "@prisma/client";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Button } from "~/components/ui/button";
import { getListOfImages } from "~/utils/server";

import { parseWithZod } from "@conform-to/zod";
import { revalidatePath } from "next/cache";
import { NpcForm } from "~/features/npcs/components/NpcForm";
import { npcSchema } from "~/features/npcs/schemas";
import { userSatisfiesRoleOrRedirect } from "~/server/auth/roles";
import { api } from "~/trpc/server";
import type { ConformResult } from "~/types/actions";

export function generateMetadata() {
	return {
		title: "Add Npc",
	};
}

export default async function AddNpc() {
	await userSatisfiesRoleOrRedirect(Role.MODERATOR, "/npcs");

	return (
		<div className="w-full max-w-screen-xl">
			<Button size="sm" variant="outline" className="mb-5" asChild>
				<Link href="/npcs">
					<ChevronLeft className="mr-2 h-4 w-4" />
					Back to npcs
				</Link>
			</Button>
			<NpcForm />
		</div>
	);
}
