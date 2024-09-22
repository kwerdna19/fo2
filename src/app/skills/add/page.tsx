import { Role } from "@prisma/client";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { SkillForm } from "~/features/skills/components/SkillForm";
import { userSatisfiesRoleOrRedirect } from "~/server/auth/roles";

export function generateMetadata() {
	return {
		title: "Add Skill",
	};
}

export default async function AddSkill() {
	await userSatisfiesRoleOrRedirect(Role.MODERATOR, "/skills");

	return (
		<div className="w-full max-w-screen-xl">
			<Button size="sm" variant="outline" className="mb-5" asChild>
				<Link href="/skills">
					<ChevronLeft className="mr-2 h-4 w-4" />
					Back to skills
				</Link>
			</Button>
			<SkillForm />
		</div>
	);
}
