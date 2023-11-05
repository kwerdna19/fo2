import { Role } from "@prisma/client"
import { notFound } from "next/navigation"
import { getListOfImages, invalidate } from "~/utils/server"
import { Button } from "~/components/ui/button"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"
import MobForm from "~/components/forms/MobForm"
import { staticApi } from "~/trpc/server"
import { userSatisfiesRoleOrRedirect } from "~/server/auth/roles"

interface Params { slug: string }

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Params }) {
  const mob = await staticApi.mob.getBySlug.fetch(params.slug)
  if(!mob) {
    return {}
  }
  return {
    title: `Edit ${mob.name}`,
  }
}

export default async function EditMob({ params }: { params: Params }) {

  await userSatisfiesRoleOrRedirect(Role.MODERATOR, '/mobs/' + params.slug)

  const mob = await staticApi.mob.getBySlug.fetch(params.slug)

  if(!mob) {
    return notFound()
  }

  const areas = await staticApi.area.getAllQuick.fetch()
  const items = await staticApi.item.getAllQuick.fetch()

  const sprites = getListOfImages('mob')

  if(!sprites) {
    notFound()
  }

    return <div className="w-full max-w-screen-xl">
    <Button size="sm" variant="outline" className="mb-5" asChild>
      <Link href={`/mobs/${mob.slug}`}>
        <ChevronLeft className="mr-2 h-4 w-4" />
        Back to page
      </Link>
    </Button>
    <MobForm areas={areas} items={items} sprites={sprites} initialValues={mob} onComplete={invalidate} />
  </div>
}