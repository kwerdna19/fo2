import { notFound } from "next/navigation"
import { Pencil } from "lucide-react"
import { AdminButton } from "~/components/AdminButton"
import { MobSprite } from "~/components/MobSprite"
import { api } from "~/trpc/server"

interface Params { slug: string }

export async function generateMetadata({ params }: { params: Params }) {
  const item = await api.npc.getBySlug.query(params.slug)
  if(!item) {
    return {}
  }
  return {
    title: item.name,
  }
}

export default async function Npc({ params }: { params: Params }) {

  const npc = await api.npc.getBySlug.query(params.slug)

  if(!npc) {
    notFound()
  }

  return <div>
    <div className="flex gap-x-4">
      <h2 className="text-3xl">{npc.name}</h2>
      <AdminButton size="icon" variant="outline" href={`/npcs/${params.slug}/edit`}>
        <Pencil className="w-4 h-4" />
      </AdminButton>
    </div>
    <div>
      <MobSprite size="xl" url={npc.spriteUrl} name={npc.name}/>
    </div>
  </div>
}