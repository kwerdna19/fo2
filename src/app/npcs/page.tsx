import { NpcTable } from "~/components/tables/npcs/NpcTable"
import { api } from "~/trpc/server"


// 1 day
export const revalidate = 86400 // secs

export const metadata = {
  title: 'Npcs'
}

export default async function Npcs() {
  const npcs = await api.npc.getAll.query()
  return <NpcTable data={npcs} />
}