import { MobTable } from "~/components/MobTable"
import { api } from "~/utils/api"

// 1 day
export const revalidate = 86400 // secs

export default async function Mobs() {
  const mobs = await api.mob.getAll()
  return <MobTable data={mobs} />
}