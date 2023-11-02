import { notFound } from "next/navigation"
import { staticApi } from "~/trpc/server"
import dynamic from 'next/dynamic'

const SingleAreaMap = dynamic(() => import("~/components/maps/SingleAreaMap"), { ssr: false })

interface Params { slug: string }

export async function generateMetadata({ params }: { params: Params }) {
  const area = await staticApi.area.getBySlug.fetch(params.slug)
  if(!area) {
    return {}
  }
  return {
    title: area.name,
  }
}

export async function generateStaticParams() {
  const areas = await staticApi.area.getAllQuick.fetch()
  return areas.map((area) => ({
    slug: area.slug,
  }))
}

export default async function Area({ params }: { params: Params }) {

  const area = await staticApi.area.getBySlug.fetch(params.slug)

  if(!area) {
    notFound()
  }

  return <div className="w-full flex flex-col items-center gap-y-8">
    <h2 className="text-3xl">{area.name}</h2>
    <SingleAreaMap area={area} />
  </div>
}