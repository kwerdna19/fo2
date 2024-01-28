import { notFound } from "next/navigation"
import { Pencil } from "lucide-react"
import { AdminButton } from "~/components/AdminButton"
import { getAllBattlePasses, getBattlePassBySlug } from "~/features/battlepasses/requests"
import { format } from 'date-fns'
import { Badge } from "~/components/ui/badge"
import { Card } from "~/components/ui/card"
import { UnitSprite } from "~/components/UnitSprite"
import { ItemSprite } from "~/components/ItemSprite"
import Link from "next/link"

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

export async function generateStaticParams() {
  const passes = await getAllBattlePasses()
  return passes.map((pass) => ({
    slug: pass.slug,
  }))
}

export default async function BattlePass({ params }: { params: Params }) {

  const pass = await getBattlePassBySlug(params.slug)

  if(!pass) {
    notFound()
  }

  return <div className="w-full">
    <div className="flex gap-x-4">
      <h2 className="text-3xl">{pass.name}</h2>
      <AdminButton size="icon" variant="outline" href={`/battlepass/${params.slug}/edit`}>
        <Pencil className="w-4 h-4" />
      </AdminButton>
    </div>
    <div className="flex items-center gap-x-3 pt-2 pb-4">
      <Badge>{pass.durationDays} days</Badge>
      <Badge variant="secondary">{pass.tiers.length} tiers</Badge>
      <Badge variant="outline">{pass.xpPerTier} XP / tier</Badge>
      {/* {format(pass.startDate, 'PP')}
      {pass.endDate ? ` - ${format(pass.endDate, 'PP')}` : <><Badge>Current</Badge></>} */}
    </div>
    <div className="space-y-3 max-w-screen-sm w-full pb-8">
      {pass.tiers.map(tier => {

        const currency = tier.unit !== null ? <div className="flex gap-x-4 items-center text-lg">
          <UnitSprite size="lg" type={tier.unit} />
          {tier.amount ?? '???'}
        </div> : null

        const item = tier.item !== null ? <div className="flex gap-x-4 items-center text-lg">
          <ItemSprite size="sm" name={tier.item.name} url={tier.item.spriteUrl} />
          <Link href={`/items/${tier.item.slug}`} prefetch={false}>
            {tier.item.name}
          </Link>
        </div> : null

        return <Card key={tier.battlePassId + '.' + tier.tier} className="flex w-full p-5 gap-x-8">
          <div className="text-xl font-sans flex justify-center items-center">
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Tier</p>
              <p>{tier.tier}</p>
            </div>
          </div>
          <div className="flex-1 flex items-center gap-x-5 flex-wrap">
            {currency}
            {item}
            {
              currency === null && item === null && <div className="text-lg">
                ???
              </div>
            }
          </div>
        </Card>
      })}
    </div>
  </div>
}