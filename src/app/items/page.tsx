import { ItemTable } from "~/components/tables/items/ItemTable"
import { getAllItems } from "~/features/items/requests"

export const metadata = {
  title: 'Items'
}

export default async function Mobs() {
  const items = await getAllItems()
  return <ItemTable data={items} />
}