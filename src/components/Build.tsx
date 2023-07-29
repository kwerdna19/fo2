'use client'

import { type Item } from "@prisma/client"
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "./ui/tooltip"
import Link from "next/link"
import { ItemSprite } from "./ItemSprite"
import { Build, PossibleBuild, Slot, getPossibleBuildFromItems, playerSlots, slotBackgroundSpriteMap, visibleEquipment } from "~/utils/fo"
import { ItemStats } from "./tables/items/ItemStats"
import { useState } from "react"
import { Button } from "./ui/button"
import { cn } from "~/utils/styles"
import { LuChevronDown, LuChevronUp } from "react-icons/lu"
import { MobSprite } from "./MobSprite"
import { basename } from "path"

function BuildItem({ item, tooltipSide, slot, stat, switchOptions }: { item?: Item | null, slot: Slot, tooltipSide: 'left' | 'right', stat: string, opt: 'max' | 'min', switchOptions?: (inc: 1 | -1) => void }) {

  const trigger = item ? <Link href={`/items/${item.slug}`}>
  <ItemSprite
    className="border-2 shadow-sm border-slate-200 bg-slate-50 rounded-sm"
    url={item.spriteUrl}
    name={item.name}
    size="md"
  />
</Link> : <div className="border-2 shadow-sm border-slate-300 bg-slate-200 flex items-center justify-center rounded-sm w-[70px] h-[70px]">
    <ItemSprite
        url={slotBackgroundSpriteMap[slot]}
        name={Slot[slot]}
        size="sm"
    />
  </div>

const tooltip = item ? <>
        <div className="mb-2 font-bold">{item.name}</div>
        <ItemStats stats={item} />
  </> : <div>You can use any item in the {Slot[slot]} slot that does not have negative {stat.toUpperCase()}</div>


  return (<div className={cn("flex gap-x-2", tooltipSide === 'left' ? 'flex-row-reverse' : '')}>
    <TooltipProvider>
    <Tooltip delayDuration={0}>
      <TooltipTrigger>
        {trigger}
      </TooltipTrigger>
      <TooltipContent side={tooltipSide} sideOffset={10} className="min-w-[8rem] max-w-[12rem]">
        {tooltip}
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
  {switchOptions !== undefined ? <div className="flex flex-col justify-between py-1">
    <Button size="icon" onClick={() => switchOptions(1)} className="h-7 w-7">
      <LuChevronUp className="h-5 w-5" />
    </Button>
    <Button size="icon" onClick={() => switchOptions(-1)}  className="h-7 w-7">
      <LuChevronDown className="h-5 w-5" />
    </Button>
  </div> : null}
  </div>)


}


function CharacterPreview({ className, build }: { build: Build, className?: string }) {

  const items = visibleEquipment.map(e => build[Slot[e]]).filter(Boolean) as Item[]

  const itemSlugs = items.map(item => basename(item.spriteUrl).replace(/\.png$/, '').replace(/\-icon$/, ''))
  
  const url = `https://art.fantasyonline2.com/api/character/ss?f=body-1_eyes-standard-blue_${itemSlugs.join('_')}`

  const alt = `Character wearing ${items.map(item => item.name).join(', ')}`

  return (<MobSprite size="3xl" className={className} url={url.replace(/\s/g, '')} name={alt} />)

}


export default function Build({ items, stat, opt }: { items: Item[], stat: string, opt: 'max' | 'min' }) {

  const possibleBuilds = getPossibleBuildFromItems(items)

  const [selectedIndices, setSelectedIndices] = useState<Record<keyof PossibleBuild, number>>({
    [Slot.HEAD]: 0,
    [Slot.FACE]: 0,
    [Slot.BACK]: 0,
    [Slot.SHOULDERS]: 0,
    [Slot.CHEST]: 0,
    [Slot.LEGS]: 0,
    [Slot.LEFT_RING]: 0,
    [Slot.RIGHT_RING]: 0,
    [Slot.MAIN_HAND]: 0,
    [Slot.LEFT_TRINKET]: 0,
    [Slot.RIGHT_TRINKET]: 0,
    [Slot.GUILD]: 0,
    [Slot.OFFHAND]: 0,
  })

  const build = playerSlots.reduce((acc, slot) => {
    acc[slot] = possibleBuilds[slot]?.at(selectedIndices[slot])
    return acc
  }, {} as Build)


  return <>
  <div className="grid grid-cols-[1fr_400px_1fr] gap-4 grid-rows-7">

      {playerSlots.map((slot, i) => {
        
        const possibleItems = possibleBuilds[slot]

        const hasOptions = !!possibleItems && possibleItems.length > 1

        const item = possibleItems?.at(selectedIndices[slot])
        const row = (i % 7) + 1
        const col = i < 7 ? 1 : 3

        const switchOptions = (inc: 1 | -1) => {
          if(!possibleItems) {
            return
          }
          if(inc === 1) {
            return setSelectedIndices(sel => ({
              ...sel,
              [slot]: sel[slot] + 1 >= possibleItems.length ? 0 : sel[slot] + 1
            }))
          }
          return setSelectedIndices(sel => ({
            ...sel,
            [slot]: sel[slot] - 1 < 0 ? possibleItems.length-1 : sel[slot] - 1
          }))

        }

        return (<div key={slot} style={{gridRow: row , gridColumn: col }}>
       <BuildItem opt={opt} slot={slot} item={item} tooltipSide={col === 1 ? 'left' : 'right'} stat={stat} switchOptions={hasOptions ? switchOptions : undefined}/>
      </div>)
      }
      )}
    {/* <div style={{gridRow: 0 + 1, gridColumn: 3}}>
    {item ? <BuildItem item={item} /> : <div>no</div>}
    </div> */}

    <div className="border col-start-2 col-end-2 row-span-full flex items-center justify-center">
      <CharacterPreview build={build} className="-mt-4" />
    </div>


    {/* <div>
      {items.map(item => <div key={item.id}>
          <BuildItem item={item} />
        </div>
      )}
    </div> */}


  </div>
  </>
}