'use client'

import { type Build, type PossibleBuild, type Slot, playerSlots } from "~/utils/fo"
import { CharacterPreview } from "./CharacterPreview"
import { PossibleBuildItem } from "./PossibleBuildItem"


interface Props {
  stat?: string,
  opt: 'max' | 'min',
  possibleBuilds: PossibleBuild,
  selectedBuild: Build,
  updateSlot: (slot: Slot, inc: 1 | -1) => void
  health?: number
  energy?: number
}

export default function PossibleEquipmentBuild({ possibleBuilds, selectedBuild, stat, updateSlot, energy, health }: Props) {

  return (<div className="grid grid-cols-[1fr_400px_1fr] gap-4 grid-rows-7">
      {playerSlots.map((slot, i) => {

        const row = (i % 7) + 1
        const col = i < 7 ? 1 : 3

        if(slot === null) {
          return (<div key={slot} style={{gridRow: row , gridColumn: col }} />)
        }

        const possibleItems = possibleBuilds[slot]
        const hasOptions = !!possibleItems && possibleItems.length > 1

        const item = selectedBuild[slot]

        return (<div key={slot} style={{gridRow: row , gridColumn: col }}>
       <PossibleBuildItem slot={slot} item={item} tooltipSide={col === 1 ? 'left' : 'right'} stat={stat} switchOptions={hasOptions ? (inc: 1 | -1) => updateSlot(slot, inc) : undefined}/>
      </div>)
      }
      )}
      <div className="border col-start-2 col-end-2 row-span-full flex items-center justify-center rounded-sm relative">
        <CharacterPreview build={selectedBuild} className="-mt-4" />

        <div className="absolute bottom-0 w-full flex p-5 gap-x-5">

          <div className="flex-1 flex items-center bg-blue-600 border-2 border-black text-white px-2 justify-between rounded-sm">
            <div className="pb-0.5">
              Energy
            </div>
            <div>
              {energy}/{energy}
            </div>
          </div>


          <div className="flex-1 flex items-center bg-red-600 border-2 border-black text-white px-2 justify-between rounded-sm">
            <div className="pb-0.5">
              Health
            </div>
            <div>
              {health}/{health}
            </div>
          </div>

        </div>
      </div>
  </div>)
}