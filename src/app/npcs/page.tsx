import { NpcTable } from "~/components/tables/npcs/NpcTable"
import { api } from "~/utils/api"


// 1 day
export const revalidate = 86400 // secs

export const metadata = {
  title: 'Npcs'
}

export default async function Npcs() {
  const npcs = await (await api()).npc.getAll()
  return <NpcTable data={npcs} />
}