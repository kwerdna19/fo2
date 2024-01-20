import { notFound } from "next/navigation"
import { Pencil } from "lucide-react"
import { AdminButton } from "~/components/AdminButton"
import { getBattlePassBySlug } from "~/features/battlepasses/requests"

interface Params { slug: string }

export async function generateMetadata({ params }: { params: Params }) {
  const pass = await getBattlePassBySlug(params.slug)
  if(!pass) {
    return {}
  }
  return {
    title: pass.name,
  }
}

export default async function BattlePass({ params }: { params: Params }) {

  const pass = await getBattlePassBySlug(params.slug)

  if(!pass) {
    notFound()
  }

  return <div>
    <div className="flex gap-x-4">
      <h2 className="text-3xl">{pass.name}</h2>
      <AdminButton size="icon" variant="outline" href={`/battlepass/${params.slug}/edit`}>
        <Pencil className="w-4 h-4" />
      </AdminButton>
    </div>
    <div>
      <pre>{JSON.stringify(pass, null, 2)}</pre>
    </div>
  </div>
}