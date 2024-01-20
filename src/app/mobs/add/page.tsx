import { Role } from "@prisma/client"
import { notFound, redirect } from "next/navigation"
import { getListOfImages } from "~/utils/server"
import { Button } from "~/components/ui/button"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"
import { MobForm } from "~/features/mobs/components/MobForm"

import { userSatisfiesRoleOrRedirect } from "~/server/auth/roles"
import { revalidatePath } from "next/cache"
import { type ConformResult } from "~/types/actions"
import { createMob } from "~/features/mobs/requests"
import { parseWithZod } from "@conform-to/zod"
import { mobSchema } from "~/features/mobs/schemas"
import { getAllAreasQuick } from "~/features/areas/requests"
import { getAllItemsQuick } from "~/features/items/requests"


export function generateMetadata() {
  return {
    title: `Add Mob`,
  }
}

export default async function AddMob() {

  await userSatisfiesRoleOrRedirect(Role.MODERATOR, `/mobs`)

  const areas = await getAllAreasQuick()
  const items = await getAllItemsQuick()
  const sprites = getListOfImages('mob')

  if(!sprites) {
    notFound()
  }

  async function action(result: ConformResult, formData: FormData) {
      'use server'
      const submission = parseWithZod(formData, {
        schema: mobSchema,
      });
    
      if (submission.status !== 'success') {
        return submission.reply()
      }
  
      try {
        
        const created = await createMob(submission.value)
        
        revalidatePath('/mobs')
        revalidatePath('/items')
        revalidatePath('/areas')

        redirect(`/mobs/${created.slug}`)

      } catch(e) {
  
        return submission.reply({
          formErrors: ['Server error']
        })
  
      }
  }

  return (<div className="w-full max-w-screen-xl">
  <Button size="sm" variant="outline" className="mb-5" asChild>
    <Link prefetch={false} href={`/mobs`}>
      <ChevronLeft className="mr-2 h-4 w-4" />
      Back to mobs
    </Link>
  </Button>
  <MobForm action={action} areas={areas} items={items} sprites={sprites} />
</div>)
}
