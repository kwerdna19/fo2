import { Role } from "@prisma/client";


export const rolePriorities = [Role.USER, Role.MODERATOR, Role.ADMIN]

export const getRolePriority = (r: Role) => rolePriorities.indexOf(r)

export const satisfiesRole = (targetRole: Role) => (roleToCheck: Role) =>  getRolePriority(roleToCheck) >= getRolePriority(targetRole)