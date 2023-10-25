import { Role } from "@prisma/client"
import { notFound } from "next/navigation"
import NpcForm from "~/components/forms/NpcForm"
import { userSatisfiesRoleOrRedirect } from "~/server/auth/roles"
import { getListOfImages } from "~/utils/server"
import { addNpc } from "./actions"
import { api } from "~/trpc/server"

// 1 day
export const revalidate = 86400 // secs

export const metadata = {
  title: 'Add Npc'
}

export default async function EditNpc() {

  await userSatisfiesRoleOrRedirect(Role.MODERATOR, '/npcs')

  const areas = await api.area.getAllQuick.query()

  const items = await api.item.getAllQuick.query()

  const sprites = getListOfImages('npcs')

  if(!sprites) {
    notFound()
  }

    return <div className="w-full max-w-screen-xl">
    <h2 className="text-3xl mb-4">Add</h2>
    <NpcForm onSubmit={addNpc} areas={areas} items={items} sprites={sprites} />
  </div>
}