import { Role } from "@prisma/client";


export const rolePriorities = [Role.USER, Role.MODERATOR, Role.ADMIN]

export const getRolePriority = (r: Role | undefined) => !!r && rolePriorities.indexOf(r)

export const satisfiesRole = (targetRole: Role) => (roleToCheck: Role | undefined) =>  getRolePriority(roleToCheck) >= getRolePriority(targetRole)