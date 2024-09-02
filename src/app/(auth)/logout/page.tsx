import { signOut } from "~/server/auth/auth";

export const dynamic = "force-dynamic";

export default async function Logout() {
	await signOut({ redirect: true, redirectTo: "/login" });
	return null;
}
