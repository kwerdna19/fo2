import { redirect } from "next/navigation"
import LoginCard from "~/components/layout/LoginCard"
import { auth } from "~/server/auth"

export default async function Login() {

  const session = await auth()
  if(session && session.user) {
    redirect('/')
  }

  return <div className="w-full flex justify-center items-center">
    <LoginCard />
  </div>
}