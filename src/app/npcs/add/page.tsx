// import { notFound } from "next/navigation"
// import { ItemSprite } from "~/components/ItemSprite"
// import { api } from "~/utils/api"

import { Role } from "@prisma/client"
import { redirect } from "next/navigation"
import NpcForm from "~/components/forms/NpcForm"
import { satisfiesRole } from "~/server/auth/roles"
import { getServerSessionRsc } from "~/server/auth/util"

// 1 day
export const revalidate = 86400 // secs

// export async function generateMetadata({ params }: { params: Params }) {
//   const item = await (await api()).item.getBySlug(params.slug)
//   if(!item) {
//     return {}
//   }
//   return {
//     title: item.name,
//   }
// }

export default async function AddNpc() {

  const session = await getServerSessionRsc()

  const role = session?.user.role

  if(!role || !satisfiesRole(Role.MODERATOR)(role)) {
    return redirect('/npcs')
  }

    return <div className="w-full max-w-screen-md">
    <h2 className="text-3xl mb-4">Add</h2>
    <NpcForm />
  </div>
}