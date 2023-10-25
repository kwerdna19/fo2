import { Role } from "@prisma/client";
import { type RedirectType, redirect } from "next/navigation";
import { auth } from ".";


export const rolePriorities = [Role.USER, Role.MODERATOR, Role.ADMIN]

export const getRolePriority = (r: Role | undefined) => !!r && rolePriorities.indexOf(r)

export const roleIsSatisfied = (role: Role | undefined, minRole: Role) => {
  if(!role) {
    return false
  }
  return getRolePriority(role) >= getRolePriority(minRole)
}

export const userSatisfiesRole = async (minRole: Role) => {
  const session = await auth()
  return roleIsSatisfied(session?.user?.role, minRole)
}

export const userSatisfiesRoleOrRedirect = async (minRole: Role, redirectUrl: string, redirectType?: RedirectType | undefined) => {
  const okay = await userSatisfiesRole(minRole);
  if(okay) {
    return
  }
  return redirect(redirectUrl, redirectType)
}