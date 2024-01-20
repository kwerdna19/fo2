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
import { getNpcBySlug, updateNpc } from "~/features/npcs/requests"
import { npcSchema } from "~/features/npcs/schemas"
import { NpcForm } from "~/features/npcs/components/NpcForm"

interface Params { slug: string }

export async function generateMetadata({ params }: { params: Params }) {
  const npc = await getNpcBySlug(params.slug)
  if(!npc) {
    return {}
  }
  return {
    title: `Edit ${npc.name}`,
  }
}

export default async function EditNpc({ params }: { params: Params }) {

  await userSatisfiesRoleOrRedirect(Role.MODERATOR, `/npcs/${params.slug}`)

  const npc = await getNpcBySlug(params.slug)

  if(!npc) {
    return notFound()
  }

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
        
        const updated = await updateNpc(npc!.id, submission.value)
        
        revalidatePath('/npcs')
        revalidatePath('/items')
        revalidatePath('/areas')

        if(updated.slug !== npc!.slug) {
          redirect(`/npcs/${updated.slug}/edit`)
        }

        return submission.reply()

      } catch(e) {
  
        return submission.reply({
          formErrors: ['Server error']
        })
  
      }
  }

  return (<div className="w-full max-w-screen-xl">
  <Button size="sm" variant="outline" className="mb-5" asChild>
    <Link prefetch={false} href={`/npcs/${npc.slug}`}>
      <ChevronLeft className="mr-2 h-4 w-4" />
      Back to page
    </Link>
  </Button>
  <NpcForm action={action} areas={areas} items={items} sprites={sprites} defaultValue={npc} />
</div>)
}
