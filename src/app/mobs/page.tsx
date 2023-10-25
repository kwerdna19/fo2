import { MobTable } from "~/components/tables/mobs/MobTable"
import { api } from "~/trpc/server"

// 1 day
export const revalidate = 86400 // secs

export const metadata = {
  title: 'Mobs'
}

export default async function Mobs() {
  const mobs = await api.mob.getAll.query()
  return <MobTable data={mobs} />
}