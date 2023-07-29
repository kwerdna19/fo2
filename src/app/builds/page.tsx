import Build from "~/components/Build"
import { api } from "~/utils/api"
import { getBuildFromItems, getPossibleBuildFromItems } from "~/utils/fo"

// 1 day
export const revalidate = 86400 // secs

export const metadata = {
  title: 'Builds'
}

export default async function Builds() {

  const items = await api.item.getMaxes({
    stat: 'str',
  })


  return <div className="w-full flex flex-col items-center">
    <div>STR</div>
    <Build items={items} stat="str" opt="max" />
  </div>
}