import MultiAreaMap from "~/components/maps/MultiAreaMap"
import { api } from "~/utils/api"

// 1 day
export const revalidate = 86400 // secs

export const metadata = {
  title: 'Areas'
}

export default async function Areas() {
  const areas = await api.area.getAllPopulated()


  return <div className="w-full flex flex-col items-center gap-y-6">
    <h2 className="text-3xl">World Map</h2>
    <MultiAreaMap areas={areas} bg="#1F4A57" />
  </div>
}