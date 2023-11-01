import { Header as ClientHeader} from './Header'
import { staticApi } from "~/trpc/server"

export async function Header() {
  const areas = await staticApi.area.getAllPopulated.fetch()
  return (<ClientHeader areas={areas} />)
}

