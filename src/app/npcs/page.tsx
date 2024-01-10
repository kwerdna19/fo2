import { NpcTable } from "~/components/tables/npcs/NpcTable"
import { getAllNpcs } from "~/features/npcs/requests"

export const metadata = {
  title: 'Npcs'
}

export default async function Npcs() {
  const npcs = await getAllNpcs()
  return <NpcTable data={npcs} />
}