
import BuildPlayground from "~/components/builds/BuildPlayground";
import { staticApi } from "~/trpc/server";

export const metadata = {
  title: 'Build'
}

export default async function Builds() {

  const items = await staticApi.item.getAllEquipment.fetch()


  return <BuildPlayground items={items} />
}