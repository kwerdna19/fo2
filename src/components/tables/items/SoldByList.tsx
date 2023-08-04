'use client';
import { cn } from "~/utils/styles";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "~/components/ui/tooltip";
import { type Datum } from "./ItemTable";
import { MobSprite } from "~/components/MobSprite";
import Link from "next/link";
import { GoldCount } from "~/components/GoldCount";

export function SoldByList({ npcs, className }: { npcs: Datum['soldBy']; className?: string; }) {

  return (<div className={cn("flex flex-wrap items-center gap-x-4", className)}>
    {npcs.map(d => <div key={d.npcId}><TooltipProvider>
      <Tooltip delayDuration={0}>
        <TooltipTrigger className="block pt-1">
          <Link href={`/npcs/${d.npc.slug}`}>
            <MobSprite
              url={d.npc.spriteUrl}
              name={d.npc.name}
              size="sm"
              className="pb-4 -mt-8"
            />
          </Link>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>{d.npc.name}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
      <div className="text-sm pb-1 -mt-3 px-1 flex justify-center space-x-1">
        <GoldCount count={d.price} size="xs" />
      </div>
    </div>
    )}
  </div>);

}
