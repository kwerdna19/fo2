import { Role } from "@prisma/client";
import { type RedirectType, redirect } from "next/navigation";
import { auth } from "./auth";

export const rolePriorities = [Role.USER, Role.MODERATOR, Role.ADMIN];

export const getRolePriority = (r: Role | undefined) =>
	!!r && rolePriorities.indexOf(r);

export const roleIsSatisfied = (minRole: Role, role: Role | undefined) => {
	if (!role) {
		return false;
	}
	return getRolePriority(role) >= getRolePriority(minRole);
};

export const userSatisfiesRole = async (minRole: Role) => {
	const session = await auth();
	return roleIsSatisfied(minRole, session?.user?.role);
};

export const userSatisfiesRoleOrRedirect = async (
	minRole: Role,
	redirectUrl: string,
	redirectType?: RedirectType | undefined,
) => {
	const okay = await userSatisfiesRole(minRole);
	if (okay) {
		return;
	}
	return redirect(redirectUrl, redirectType);
};
