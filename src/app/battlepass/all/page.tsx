import { getAllBattlePasses } from "~/features/battlepasses/requests"

export const metadata = {
  title: 'All Battlepasses'
}

export default async function BattlePasses() {
  const passes = await getAllBattlePasses()
  return <pre>{JSON.stringify(passes, null, 2)}</pre>
}