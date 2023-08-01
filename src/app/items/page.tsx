import { ItemTable } from "~/components/tables/items/ItemTable"
import { api } from "~/utils/api"

// 1 day
export const revalidate = 86400 // secs

export const metadata = {
  title: 'Items'
}

export default async function Mobs() {
  const items = await (await api()).item.getAll()
  return <ItemTable data={items} />
}