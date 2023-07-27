import { api } from "~/utils/api"

// 1 day
export const revalidate = 86400 // secs

export const metadata = {
  title: 'Areas'
}

export default function Areas() {
  // const mobs = await api.mob.getAll()
  return <div>areas</div>
}