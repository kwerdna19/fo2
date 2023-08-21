import { Role } from "@prisma/client"
import { notFound, redirect } from "next/navigation"
import { satisfiesRole } from "~/server/auth/roles"
import { getServerSessionRsc } from "~/server/auth/util"
import { api } from "~/utils/api"
import { getListOfImages } from "~/utils/server"
import MobForm from "~/components/forms/MobForm"
import { addMob } from "./actions"

// 1 day
export const revalidate = 86400 // secs

export const metadata = {
  title: 'Add Mob'
}

export default async function AddMob() {

  const session = await getServerSessionRsc()

  const role = session?.user.role

  if(!satisfiesRole(Role.MODERATOR)(role)) {
    return redirect('/mobs')
  }

  const areas = await (await api()).area.getAllQuick()
  const items = await (await api()).item.getAllQuick()

  const sprites = getListOfImages('mobs')

  if(!sprites) {
    notFound()
  }

    return <div className="w-full max-w-screen-xl">
    <h2 className="text-3xl mb-4">Add</h2>
    <MobForm onSubmit={addMob} areas={areas} items={items} sprites={sprites} />
  </div>
}