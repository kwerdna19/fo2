import { api } from "~/utils/api"

// 1 day
export const revalidate = 86400 // secs
export default async function Mob({ params }: { params: { name: string } }) {

  const { name } = params
  const mob = await api.mob.getByName.query(name)

  return <div>Mob {mob.name}</div>
}