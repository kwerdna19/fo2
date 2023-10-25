import { Role } from "@prisma/client"
import { notFound } from "next/navigation"
import NpcForm from "~/components/forms/NpcForm"
import { userSatisfiesRoleOrRedirect } from "~/server/auth/roles"
import { getListOfImages } from "~/utils/server"
import { editNpc } from "./actions"
import { Button } from "~/components/ui/button"
import { LuChevronLeft } from "react-icons/lu"
import Link from "next/link"
import { api } from "~/trpc/server"

// 1 day
export const revalidate = 86400 // secs

interface Params { slug: string }

export async function generateMetadata({ params }: { params: Params }) {
  const npc = await api.npc.getBySlug.query(params.slug)
  if(!npc) {
    return {}
  }
  return {
    title: `Edit ${npc.name}`,
  }
}

export default async function EditNpc({ params }: { params: Params }) {

  await userSatisfiesRoleOrRedirect(Role.MODERATOR, '/npcs/' + params.slug)

  const npc = await api.npc.getBySlug.query(params.slug)

  if(!npc) {
    return notFound()
  }

  const areas = await api.area.getAllQuick.query()
  const items = await api.item.getAllQuick.query()

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