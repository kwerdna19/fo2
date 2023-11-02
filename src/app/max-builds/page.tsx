
import MaxMinBuildsPage from "~/components/builds/MaxMinBuildsPage";
import { staticApi } from "~/trpc/server";
import { type RouterInputs } from "~/trpc/shared";

export const metadata = {
  title: 'Max Builds'
}

const stats = ['agi', 'str', 'sta', 'int', 'armor'] as const

export default async function Builds() {

  const getSuperlatives = (type: RouterInputs['item']['getSuperlatives']['type']) => Promise.all(stats.map(async s => staticApi.item.getSuperlatives.fetch({
    stat: s,
    type
  }))).then(([agi, str, sta, int, armor]) => ({ agi, str, sta, int, armor }))

  const [maxes, mins] = await Promise.all([getSuperlatives('max'), getSuperlatives('min')])

  return <MaxMinBuildsPage maxes={maxes} mins={mins} />
}