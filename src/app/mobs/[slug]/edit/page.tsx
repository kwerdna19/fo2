import { Role } from "@prisma/client"
import { notFound } from "next/navigation"
import { getListOfImages } from "~/utils/server"
import { editMob } from "./actions"
import { Button } from "~/components/ui/button"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"
import MobForm from "~/components/forms/MobForm"
import { api } from "~/trpc/server"
import { userSatisfiesRoleOrRedirect } from "~/server/auth/roles"

// 1 day
export const revalidate = 86400 // secs

interface Params { slug: string }

export async function generateMetadata({ params }: { params: Params }) {
  const mob = await api.mob.getBySlug.query(params.slug)
  if(!mob) {
    return {}
  }
  return {
    title: `Edit ${mob.name}`,
  }
}

export default async function EditMob({ params }: { params: Params }) {

  await userSatisfiesRoleOrRedirect(Role.MODERATOR, '/mobs/' + params.slug)

  const mob = await api.mob.getBySlug.query(params.slug)

  if(!mob) {
    return notFound()
  }

  const areas = await api.area.getAllQuick.query()
  const items = await api.item.getAllQuick.query()

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
    <MobForm onSubmit={editMob} areas={areas} items={items} sprites={sprites} initialValues={mob} />
  </div>
}