import { MobTable } from "~/components/tables/mobs/MobTable"
import { api } from "~/utils/api"

// 1 day
export const revalidate = 86400 // secs

export const metadata = {
  title: 'Mobs'
}

export default async function Mobs() {
  const mobs = await api.mob.getAll()
  return <MobTable data={mobs} />
}