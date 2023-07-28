'use client';
import { cn } from "~/utils/styles";
import { ItemSprite } from "../../ItemSprite";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "~/components/ui/tooltip";
import { UnitSprite } from "../../UnitSprite";
import { type Datum } from "./MobTable";
import Link from "next/link";
import { GoldCount } from "~/components/GoldCount";

export function DropsList({ drops, className }: { drops: Datum['drops']; className?: string; }) {

  return (<div className={cn("flex flex-wrap items-center gap-x-4", className)}>
    {drops.map(d => <div key={d.itemId}><TooltipProvider>
      <Tooltip delayDuration={0}>
        <TooltipTrigger className="block pt-1">
          <Link href={`/items/${d.item.slug}`}>
            <ItemSprite
              className="border-2 shadow-sm border-slate-200 bg-slate-50 rounded-sm"
              url={d.item.spriteUrl}
              name={d.item.name}
              size="md"
            />
          </Link>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>{d.item.name}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
      <div className="text-sm pt-1 px-1 flex items-center justify-between space-x-1">
        <div>
          <GoldCount size="xs" count={d.item.sellPrice} />
        </div>
        <div className="h-4 border-r border-gray-300" />
        <div>
        {d.dropRate ?? '?'}<span className="pl-0.5">%</span>
        </div>
      </div>
    </div>
    )}
  </div>);

}
