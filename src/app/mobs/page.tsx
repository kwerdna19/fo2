import { MobTable } from "~/components/MobTable"
import { api, getBaseUrl } from "~/utils/api"

// 1 day
export const revalidate = 86400 // secs

export default async function Mobs() {
  console.log('getBaseUrl()', getBaseUrl())
  const mobs = await api.mob.getAll.query()
  return <MobTable data={mobs} />
}