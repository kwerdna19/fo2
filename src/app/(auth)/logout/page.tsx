import { signOut } from "~/server/auth"

export default async function Logout() {
  await signOut({ redirect: true, redirectTo: '/login' })
  return null
}