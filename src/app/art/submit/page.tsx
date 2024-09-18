import { Role } from "@prisma/client";
import { ArtForm } from "~/features/art/components/ArtForm";
import { userSatisfiesRoleOrRedirect } from "~/server/auth/roles";

export const metadata = {
	title: "Art Submission",
};

export default async function Page() {
	await userSatisfiesRoleOrRedirect(Role.USER, "/");

	return <ArtForm />;
}
