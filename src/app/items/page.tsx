import { ItemTable } from "~/components/tables/items/ItemTable"
import { staticApi } from "~/trpc/server"

export const metadata = {
  title: 'Items'
}

export default async function Mobs() {
  const items = await staticApi.item.getAll.fetch()
  return <ItemTable data={items} />
}