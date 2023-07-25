import { notFound } from "next/navigation"
import { ItemSprite } from "~/components/ItemSprite"
import { api } from "~/utils/api"

// 1 day
export const revalidate = 86400 // secs

interface Params { slug: string }

export async function generateMetadata({ params }: { params: Params }) {
  const item = await api.item.getBySlug(params.slug)
  if(!item) {
    return {}
  }
  return {
    title: item.name,
  }
}

export default async function Item({ params }: { params: Params }) {

  const item = await api.item.getBySlug(params.slug)

  if(!item) {
    notFound()
  }

  return <div>
    <h2 className="text-3xl">{item.name}</h2>
    <div>
      <ItemSprite size="xl" url={item.spriteUrl} name={item.name}/>
    </div>
  </div>
}