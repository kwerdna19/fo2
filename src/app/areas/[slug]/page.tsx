import { notFound } from "next/navigation"
import AreaMap from "~/components/AreaMap"
import { api } from "~/utils/api"

// 1 day
export const revalidate = 86400 // secs

interface Params { slug: string }

export async function generateMetadata({ params }: { params: Params }) {
  const area = await api.area.getBySlug(params.slug)
  if(!area) {
    return {}
  }
  return {
    title: area.name,
  }
}

export default async function Area({ params }: { params: Params }) {

  const area = await api.area.getBySlug(params.slug)

  if(!area) {
    notFound()
  }

  return <div className="w-full flex flex-col items-center gap-y-8">
    <h2 className="text-3xl">{area.name}</h2>
    <AreaMap area={area} />
  </div>
}