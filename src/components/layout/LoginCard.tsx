'use client'

// import { signIn } from "next-auth/react"
// import { Button } from "~/components/ui/button"
import { Card,
  CardContent,
  CardHeader,
  CardTitle
 } from "~/components/ui/card"
// import { icons } from "../social-icons"


export default function LoginCard() {

  // todo fetch providers form endpoint then render cards
  // https://authjs.dev/guides/upgrade-to-v5?authentication-method=client-component#authentication-methods


  return <Card className="max-w-sm w-full">
      <CardHeader>
        <CardTitle className="text-xl text-center">Login</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-5">
          {/* {
            providers.map(p => {
            return ( <Button onClick={() => void signIn(p.id)} key={p.id} variant="outline" className="gap-x-3">
              {icons[p.id]}{p.name}
            </Button>)
            })
          } */}
        </div>
      </CardContent>
    </Card>
}