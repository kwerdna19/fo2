import { Role } from "@prisma/client"
import { notFound, redirect } from "next/navigation"
import { getListOfImages } from "~/utils/server"
import { Button } from "~/components/ui/button"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"

import { userSatisfiesRoleOrRedirect } from "~/server/auth/roles"
import { revalidatePath } from "next/cache"
import { type ConformResult } from "~/types/actions"
import { parseWithZod } from "@conform-to/zod"
import { getAllAreasQuick } from "~/features/areas/requests"
import { getAllItemsQuick } from "~/features/items/requests"
import { NpcForm } from "~/features/npcs/components/NpcForm"
import { npcSchema } from "~/features/npcs/schemas"
import { createNpc } from "~/features/npcs/requests"


export function generateMetadata() {
  return {
    title: `Add Npc`,
  }
}

export default async function AddNpc() {

  await userSatisfiesRoleOrRedirect(Role.MODERATOR, `/npcs`)

  const areas = await getAllAreasQuick()
  const items = await getAllItemsQuick()
  const sprites = getListOfImages('npc')

  if(!sprites) {
    notFound()
  }

  async function action(result: ConformResult, formData: FormData) {
      'use server'
      const submission = parseWithZod(formData, {
        schema: npcSchema,
      });
    
      if (submission.status !== 'success') {
        return submission.reply()
      }
  
      try {

        
        const created = await createNpc(submission.value)
        
        revalidatePath('/items')
        revalidatePath('/areas')
        revalidatePath('/npcs')

        redirect(`/npcs/${created.slug}`)

      } catch(e) {
  
        return submission.reply({
          formErrors: ['Server error']
        })
  
      }
  }

  return (<div className="w-full max-w-screen-xl">
  <Button size="sm" variant="outline" className="mb-5" asChild>
    <Link href={`/npcs`}>
      <ChevronLeft className="mr-2 h-4 w-4" />
      Back to npcs
    </Link>
  </Button>
  <NpcForm action={action} areas={areas} items={items} sprites={sprites} />
</div>)
}
