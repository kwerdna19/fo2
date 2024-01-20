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
import { getItemBySlug, updateItem } from "~/features/items/requests"
import { itemSchema } from "~/features/items/schemas"
import { ItemForm } from "~/features/items/components/ItemForm"
import { getAllMobsQuick } from "~/features/mobs/requests"
import { getAllNpcsQuick } from "~/features/npcs/requests"

interface Params { slug: string }

export async function generateMetadata({ params }: { params: Params }) {
  const item = await getItemBySlug(params.slug)
  if(!item) {
    return {}
  }
  return {
    title: `Edit ${item.name}`,
  }
}

export default async function EditItem({ params }: { params: Params }) {

  await userSatisfiesRoleOrRedirect(Role.MODERATOR, `/items/${params.slug}`)

  const item = await getItemBySlug(params.slug)

  if(!item) {
    return notFound()
  }

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

        console.log(submission.value)
        
        const updated = await updateItem(item!.id, submission.value)
        
        revalidatePath('/mobs')
        revalidatePath('/items')
        revalidatePath('/areas')
        // revalidatePath('/npcs')

        if(updated.slug !== item!.slug) {
          redirect(`/items/${updated.slug}/edit`)
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
    <Link prefetch={false} href={`/items/${item.slug}`}>
      <ChevronLeft className="mr-2 h-4 w-4" />
      Back to page
    </Link>
  </Button>
  <ItemForm action={action} sprites={sprites} defaultValue={item} mobs={mobs} npcs={npcs} />
</div>)
}
