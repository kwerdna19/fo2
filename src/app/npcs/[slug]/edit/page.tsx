import { Role } from "@prisma/client"
import { notFound, redirect } from "next/navigation"
import NpcForm from "~/components/forms/NpcForm"
import { satisfiesRole } from "~/server/auth/roles"
import { getServerSessionRsc } from "~/server/auth/util"
import { api } from "~/utils/api"
import { getListOfImages } from "~/utils/server"
import { editNpc } from "./actions"
import { Button } from "~/components/ui/button"
import { LuChevronLeft } from "react-icons/lu"
import Link from "next/link"

// 1 day
export const revalidate = 86400 // secs

interface Params { slug: string }

export async function generateMetadata({ params }: { params: Params }) {
  const npc = await (await api()).npc.getBySlug(params.slug)
  if(!npc) {
    return {}
  }
  return {
    title: `Edit ${npc.name}`,
  }
}

export default async function EditNpc({ params }: { params: Params }) {

  const session = await getServerSessionRsc()

  const role = session?.user.role

  if(!satisfiesRole(Role.MODERATOR)(role)) {
    return redirect('/npcs/' + params.slug)
  }

  const trpc = await api()

  const npc = await trpc.npc.getBySlug(params.slug)

  if(!npc) {
    return notFound()
  }

  const areas = await trpc.area.getAllQuick()
  const items = await trpc.item.getAllQuick()

  const sprites = getListOfImages('npcs')

  if(!sprites) {
    notFound()
  }

    return <div className="w-full max-w-screen-xl">
    <Button size="sm" variant="outline" className="mb-5" asChild>
      <Link href={`/npcs/${npc.slug}`}>
        <LuChevronLeft className="mr-2 h-4 w-4" />
        Back to page
      </Link>
    </Button>
    <NpcForm onSubmit={editNpc} areas={areas} items={items} sprites={sprites} initialValues={npc} />
  </div>
}