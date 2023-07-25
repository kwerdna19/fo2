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

export function DropsList({ drops, className }: { drops: Datum['drops']; className?: string; }) {

  return (<div className={cn("flex flex-wrap items-center gap-x-4", className)}>
    {drops.map(d => <div key={d.itemId}><TooltipProvider>
      <Tooltip delayDuration={0}>
        <TooltipTrigger className="block pt-1">
          <ItemSprite
            className="border-2 shadow-sm border-slate-200 bg-slate-50 rounded-sm"
            url={d.item.spriteUrl}
            name={d.item.name}
            size="md" />
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>{d.item.name}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
      <div className="text-sm pt-1 px-1 flex items-center space-x-1">
        <div>
          {d.item.sellPrice}
        </div>
        <UnitSprite type="coin" />
      </div>
    </div>
    )}
  </div>);

}
