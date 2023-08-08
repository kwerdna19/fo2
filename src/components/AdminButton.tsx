import { Role } from "@prisma/client"
import { satisfiesRole } from "~/server/auth/roles"
import { getServerSessionRsc } from "~/server/auth/util"
import { Button, type ButtonProps } from "./ui/button"
import Link from "next/link"


export async function AdminButton({ role: minRole = Role.MODERATOR, href, children, ...rest }: { role?: Role, href: string } & Omit<ButtonProps, 'asChild'>) {

  const session = await getServerSessionRsc()
  const role = session?.user.role

  if(!satisfiesRole(minRole)(role)) {
    return null
  }

  return (<Button asChild {...rest}>
    <Link href={href}>
      {children}
    </Link>
  </Button>)

}