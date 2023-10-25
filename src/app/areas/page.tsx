import dynamic from 'next/dynamic'
import { api } from '~/trpc/server'

// import MultiAreaMap from "~/components/maps/MultiAreaMap"
const MultiAreaMap = dynamic(() => import("~/components/maps/MultiAreaMap"), { ssr: false })

// 1 day
export const revalidate = 86400 // secs

export const metadata = {
  title: 'Areas'
}

export default async function Areas() {
  const areas = await api.area.getAllPopulated.query()

  return <div className="w-full flex flex-col items-center gap-y-6">
    <h2 className="text-3xl">World Map</h2>
    <MultiAreaMap areas={areas} bg="#1F4A57" />
  </div>
}