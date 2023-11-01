import { NpcTable } from "~/components/tables/npcs/NpcTable"
import { staticApi } from "~/trpc/server"


// 1 day
export const revalidate = 86400 // secs

export const metadata = {
  title: 'Npcs'
}

export default async function Npcs() {
  const npcs = await staticApi.npc.getAll.fetch()
  return <NpcTable data={npcs} />
}