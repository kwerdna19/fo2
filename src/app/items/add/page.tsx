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
import { createItem } from "~/features/items/requests"
import { itemSchema } from "~/features/items/schemas"
import { ItemForm } from "~/features/items/components/ItemForm"
import { getAllMobsQuick } from "~/features/mobs/requests"
import { getAllNpcsQuick } from "~/features/npcs/requests"


export function generateMetadata() {
  return {
    title: `Add Item`,
  }
}

export default async function AddItem() {

  await userSatisfiesRoleOrRedirect(Role.MODERATOR, `/items`)

  const mobs = await getAllMobsQuick()
  const npcs = await getAllNpcsQuick()

  const sprites = getListOfImages('item')

  if(!sprites) {
    notFound()
  }

  async function action(result: ConformResult, formData: FormData) {
      'use server'
      const submission = parseWithZod(formData, {
        schema: itemSchema,
      });
    
      if (submission.status !== 'success') {
        return submission.reply()
      }
  
      try {

        
        const created = await createItem(submission.value)
        
        revalidatePath('/mobs')
        revalidatePath('/items')
        revalidatePath('/areas')
        revalidatePath('/npcs')

        redirect(`/items/${created.slug}`)

      } catch(e) {
  
        return submission.reply({
          formErrors: ['Server error']
        })
  
      }
  }

  return (<div className="w-full max-w-screen-xl">
  <Button size="sm" variant="outline" className="mb-5" asChild>
    <Link href={`/items`}>
      <ChevronLeft className="mr-2 h-4 w-4" />
      Back to items
    </Link>
  </Button>
  <ItemForm action={action} sprites={sprites} mobs={mobs} npcs={npcs} />
</div>)
}
