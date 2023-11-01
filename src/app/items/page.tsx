import { ItemTable } from "~/components/tables/items/ItemTable"
import { staticApi } from "~/trpc/server"

// 1 day
export const revalidate = 86400 // secs

export const metadata = {
  title: 'Items'
}

export default async function Mobs() {
  const items = await staticApi.item.getAll.fetch()
  return <ItemTable data={items} />
}