import { Header as ClientHeader} from './Header'
import { api } from "~/trpc/server"

export async function Header() {
  const areas = await api.area.getAllPopulated.query()
  return (<ClientHeader areas={areas} />)
}

