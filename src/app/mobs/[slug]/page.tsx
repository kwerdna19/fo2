import { notFound } from "next/navigation"
import { LuPencil } from "react-icons/lu"
import { AdminButton } from "~/components/AdminButton"
import { MobSprite } from "~/components/MobSprite"
import { api } from "~/utils/api"

// 1 day
export const revalidate = 86400 // secs

interface Params { slug: string }

export async function generateMetadata({ params }: { params: Params }) {
  const mob = await (await api()).mob.getBySlug(params.slug)
  if(!mob) {
    return {}
  }
  return {
    title: mob.name,
  }
}

export default async function Mob({ params }: { params: Params }) {

  const mob = await (await api()).mob.getBySlug(params.slug)

  if(!mob) {
    notFound()
  }

  return <div>
    <div className="flex gap-x-4">
      <h2 className="text-3xl">{mob.name}</h2>
      <AdminButton size="icon" variant="outline" href={`/mobs/${params.slug}/edit`}>
        <LuPencil className="w-4 h-4" />
      </AdminButton>
    </div>
    <div>
      <MobSprite size="xl" url={mob.spriteUrl} name={mob.name}/>
    </div>
  </div>
}