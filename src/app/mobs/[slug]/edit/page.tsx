import { Role } from "@prisma/client"
import { notFound, redirect } from "next/navigation"
import { satisfiesRole } from "~/server/auth/roles"
import { getServerSessionRsc } from "~/server/auth/util"
import { api } from "~/utils/api"
import { getListOfImages } from "~/utils/server"
import { editMob } from "./actions"
import { Button } from "~/components/ui/button"
import { LuChevronLeft } from "react-icons/lu"
import Link from "next/link"
import MobForm from "~/components/forms/MobForm"

// 1 day
export const revalidate = 86400 // secs

interface Params { slug: string }

export async function generateMetadata({ params }: { params: Params }) {
  const mob = await (await api()).mob.getBySlug(params.slug)
  if(!mob) {
    return {}
  }
  return {
    title: `Edit ${mob.name}`,
  }
}

export default async function EditMob({ params }: { params: Params }) {

  const session = await getServerSessionRsc()

  const role = session?.user.role

  if(!satisfiesRole(Role.MODERATOR)(role)) {
    return redirect('/mobs/' + params.slug)
  }

  const trpc = await api()

  const mob = await trpc.mob.getBySlug(params.slug)

  if(!mob) {
    return notFound()
  }

  const areas = await trpc.area.getAllQuick()
  const items = await trpc.item.getAllQuick()

  const sprites = getListOfImages('mob')

  if(!sprites) {
    notFound()
  }

    return <div className="w-full max-w-screen-xl">
    <Button size="sm" variant="outline" className="mb-5" asChild>
      <Link href={`/mobs/${mob.slug}`}>
        <LuChevronLeft className="mr-2 h-4 w-4" />
        Back to page
      </Link>
    </Button>
    <MobForm onSubmit={editMob} areas={areas} items={items} sprites={sprites} initialValues={mob} />
  </div>
}