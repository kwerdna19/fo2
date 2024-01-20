import { Role } from "@prisma/client"
import { Button } from "~/components/ui/button"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"

import { userSatisfiesRoleOrRedirect } from "~/server/auth/roles"
import { type ConformResult } from "~/types/actions"
import { parseWithZod } from "@conform-to/zod"
import { getAllItemsQuick } from "~/features/items/requests"
import { BattlePassForm } from "~/features/battlepasses/components/BattlePassForm"
import { battlePassSchema } from "~/features/battlepasses/schemas"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createBattlePass } from "~/features/battlepasses/requests"


export function generateMetadata() {
  return {
    title: `Add Battlepass`,
  }
}

export default async function AddBattlePass() {

  await userSatisfiesRoleOrRedirect(Role.MODERATOR, `/battlepass/all`)

  const items = await getAllItemsQuick()

  async function action(result: ConformResult, formData: FormData) {
      'use server'
      const submission = parseWithZod(formData, {
        schema: battlePassSchema,
      });
    
      if (submission.status !== 'success') {
        return submission.reply()
      }
  
      try {

        const created = await createBattlePass(submission.value)
        
        revalidatePath('/items')
        revalidatePath('/battlepass/all')
        revalidatePath('/battlepass')

        redirect(`/battlepass/${created.slug}`)


      } catch(e) {

        console.error(e)
  
        return submission.reply({
          formErrors: ['Server error'],
        })
  
      }
  }

  return (<div className="w-full max-w-screen-xl">
  <Button size="sm" variant="outline" className="mb-5" asChild>
    <Link prefetch={false} href={`/battlepass/all`}>
      <ChevronLeft className="mr-2 h-4 w-4" />
      Back to passes
    </Link>
  </Button>
  <BattlePassForm
    action={action}
    items={items}
  />
</div>)
}
