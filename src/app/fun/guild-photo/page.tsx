import { Role } from "@prisma/client";
import { userSatisfiesRoleOrRedirect } from "~/server/auth/roles";
import { PhotoGen } from "./_photo_gen";

export const metadata = {
	title: "Guild Photo Gen v0.1",
};

export default async function MyCollection() {
	await userSatisfiesRoleOrRedirect(Role.MODERATOR, "/");

	return (
		<div>
			<h1>Guild Photo Gen v0.1</h1>
			<PhotoGen />
		</div>
	);
}
