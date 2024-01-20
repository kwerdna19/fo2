import { Role } from "@prisma/client"
import { userSatisfiesRole } from "~/server/auth/roles"
import { Button, type ButtonProps } from "./ui/button"
import Link from "next/link"


export async function AdminButton({ role: minRole = Role.MODERATOR, href, children, ...rest }: { role?: Role, href: string } & Omit<ButtonProps, 'asChild'>) {

  if(!(await userSatisfiesRole(minRole))) {
    return null
  }

  return (<Button asChild {...rest}>
    <Link prefetch={false} href={href}>
      {children}
    </Link>
  </Button>)

}