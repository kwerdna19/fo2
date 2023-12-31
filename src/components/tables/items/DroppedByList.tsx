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

export function DroppedByList({ mobs, className }: { mobs: Datum['droppedBy']; className?: string; }) {

  return (<div className={cn("flex flex-wrap items-center gap-x-4", className)}>
    {mobs.map(d => <div key={d.mobId}><TooltipProvider>
      <Tooltip delayDuration={0}>
        <TooltipTrigger className="block pt-1">
          <Link href={`/mobs/${d.mob.slug}`}>
            <MobSprite
              url={d.mob.spriteUrl}
              name={d.mob.name}
              size="sm"
            />
          </Link>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>{d.mob.name}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
      <div className="text-sm pb-1 -mt-3 px-1 flex justify-center space-x-1">
        <>{d.dropRate ?? '?'}<span className="pl-0.5 mr-1">%</span></>
      </div>
    </div>
    )}
  </div>);

}
