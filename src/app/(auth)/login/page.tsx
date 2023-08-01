import { getProviders } from "next-auth/react"
import { redirect } from "next/navigation"
import LoginCard from "~/components/layout/LoginCard"
import { Button } from "~/components/ui/button"
import { Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
 } from "~/components/ui/card"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
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