import { ItemTable } from "~/components/tables/items/ItemTable"
import { api } from "~/trpc/server"

// 1 day
export const revalidate = 86400 // secs

export const metadata = {
  title: 'Items'
}

export default async function Mobs() {
  const items = await api.item.getAll.query()
  return <ItemTable data={items} />
}