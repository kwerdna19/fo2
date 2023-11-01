import { MobTable } from "~/components/tables/mobs/MobTable"
import { staticApi } from "~/trpc/server"

// 1 day
export const revalidate = 86400 // secs

export const metadata = {
  title: 'Mobs'
}

export default async function Mobs() {
  const mobs = await staticApi.mob.getAll.fetch()
  return <MobTable data={mobs} />
}