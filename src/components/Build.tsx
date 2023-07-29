'use client'

import { type Item } from "@prisma/client"
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "./ui/tooltip"
import Link from "next/link"
import { ItemSprite } from "./ItemSprite"
import { Slot, getPossibleBuildFromItems, playerSlots } from "~/utils/fo"
import { ItemStats } from "./tables/items/ItemStats"

function BuildItem({ item, tooltipSide }: { item: Item, tooltipSide: 'left' | 'right' }) {

  return (<TooltipProvider>
    <Tooltip delayDuration={0}>
      <TooltipTrigger className="block">
        <Link href={`/items/${item.slug}`}>
          <ItemSprite
            className="border-2 shadow-sm border-slate-200 bg-slate-50 rounded-sm"
            url={item.spriteUrl}
            name={item.name}
            size="md"
          />
        </Link>
      </TooltipTrigger>
      <TooltipContent side={tooltipSide} sideOffset={10} className="min-w-[8rem]">
        <div className="mb-2 font-bold">{item.name}</div>
        <ItemStats stats={item} />
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>)


}

const NUM_ROWS = 7

export default function Build({ items }: { items: Item[] }) {

  const build = getPossibleBuildFromItems(items)

  const item = build['5']?.at(0)


  return <>
  <div className="grid grid-cols-[1fr_400px_1fr] gap-4 grid-rows-7">

      {playerSlots.map((slot, i) => {
        const items = build[slot]

        const item = items?.at(0)
        const row = (i % 7) + 1
        const col = i < 7 ? 1 : 3

        // TODO - allow cycling for multiple possible items

        return (<div key={slot} style={{gridRow: row , gridColumn: col }}>
       {item ? <BuildItem item={item} tooltipSide={col === 1 ? 'left' : 'right'} /> : <div className="h-full text-xs break-words flex items-center justify-center">{Slot[slot]}</div>}
      </div>)
      }
      )}
    {/* <div style={{gridRow: 0 + 1, gridColumn: 3}}>
    {item ? <BuildItem item={item} /> : <div>no</div>}
    </div> */}

    <div className="border col-start-2 col-end-2 row-span-full"/>


    {/* <div>
      {items.map(item => <div key={item.id}>
          <BuildItem item={item} />
        </div>
      )}
    </div> */}


  </div>
  </>
}