import { getProviders } from "next-auth/react"
import { redirect } from "next/navigation"
import LoginCard from "~/components/layout/LoginCard"
import { getServerSessionRsc } from "~/server/auth/util"

export default async function Login() {

  const session = await getServerSessionRsc()
  if(session && session.user) {
    redirect('/')
  }

  const providers = await getProviders()

  return <div className="w-full flex justify-center items-center">
    <LoginCard providers={providers ? Object.values(providers) : []} />
  </div>
}