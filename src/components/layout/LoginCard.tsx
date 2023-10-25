'use client'

import { Card,
  CardContent,
  CardHeader,
  CardTitle
 } from "~/components/ui/card"
import { icons } from "../social-icons"
import { useQuery } from "@tanstack/react-query"
import { type AppProvider } from "next-auth/providers"
import { signIn } from "next-auth/react"
import { Button } from "../ui/button"


export default function LoginCard() {

  const { data: providers } = useQuery({
    queryKey: ['auth', 'providers'],
    queryFn: async () => {
      const res = await fetch('/api/auth/providers')
      if(!res.ok) {
        throw new Error('Error fetching providers')
      }
      const d = await res.json() as Record<string, AppProvider>
      return d
    },
    select: (data) => {
      return Object.values(data)
    },
    staleTime: Infinity,
  })
 
  return <Card className="max-w-sm w-full">
      <CardHeader>
        <CardTitle className="text-xl text-center">Login</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-5">
          {
            providers?.map(p => {
            return ( <Button onClick={() => void signIn(p.id)} key={p.id} variant="outline" className="gap-x-3">
              {icons[p.id]}{p.name}
            </Button>)
            })
          }
        </div>
      </CardContent>
    </Card>
}