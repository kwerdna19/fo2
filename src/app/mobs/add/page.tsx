import { Role } from "@prisma/client"
import { notFound } from "next/navigation"
import { userSatisfiesRoleOrRedirect } from "~/server/auth/roles"
import { getListOfImages } from "~/utils/server"
import MobForm from "~/components/forms/MobForm"
import { addMob } from "./actions"
import { api } from "~/trpc/server"

export const metadata = {
  title: 'Add Mob'
}

export default async function AddMob() {

  await userSatisfiesRoleOrRedirect(Role.MODERATOR, '/mobs')

  const areas = await api.area.getAllQuick.query()
  const items = await api.item.getAllQuick.query()

  const sprites = getListOfImages('mob')

  if(!sprites) {
    notFound()
  }

    return <div className="w-full max-w-screen-xl">
    <h2 className="text-3xl mb-4">Add</h2>
    <MobForm onSubmit={addMob} areas={areas} items={items} sprites={sprites} />
  </div>
}