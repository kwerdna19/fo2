import { MobTable } from "~/components/tables/mobs/MobTable"
import { getAllMobs } from "~/features/mobs/requests"

export const metadata = {
  title: 'Mobs'
}

export default async function Mobs() {
  const mobs = await getAllMobs()
  return <MobTable data={mobs} />
}