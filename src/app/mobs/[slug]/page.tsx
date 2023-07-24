import { MobSprite } from "~/components/MobSprite"
import { api } from "~/utils/api"

// 1 day
export const revalidate = 86400 // secs
export default async function Mob({ params }: { params: { slug: string } }) {

  const { slug } = params
  const mob = await api.mob.getByName.query(slug)

  return <div>
    <h2 className="text-3xl">{mob.name}</h2>
    <div>
      <MobSprite size="xl" url={mob.spriteUrl} name={mob.name}/>
    </div>
  </div>
}