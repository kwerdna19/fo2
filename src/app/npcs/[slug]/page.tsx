import { notFound } from "next/navigation"
import { MobSprite } from "~/components/MobSprite"
import { api } from "~/utils/api"

// 1 day
export const revalidate = 86400 // secs

interface Params { slug: string }

export async function generateMetadata({ params }: { params: Params }) {
  const item = await (await api()).npc.getBySlug(params.slug)
  if(!item) {
    return {}
  }
  return {
    title: item.name,
  }
}

export default async function Npc({ params }: { params: Params }) {

  const npc = await (await api()).npc.getBySlug(params.slug)

  if(!npc) {
    notFound()
  }

  return <div>
    <h2 className="text-3xl">{params.slug}</h2>
    <div>
      <MobSprite size="xl" url={npc.spriteUrl} name={npc.name}/>
    </div>
  </div>
}