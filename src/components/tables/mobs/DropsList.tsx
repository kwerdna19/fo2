'use client';
import { cn } from "~/utils/styles";
import { ItemSprite } from "../../ItemSprite";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "~/components/ui/tooltip";
import { type Datum } from "./MobTable";
import Link from "next/link";
import { GoldCount } from "~/components/GoldCount";

export function DropsList({ drops, className, infoInToolTip = false, size = 'md' }: { drops: Datum['drops']; className?: string; infoInToolTip?: boolean, size?: 'md' | 'sm' }) {


  const getItemInfo = (dropRate: number | null  | undefined, sellPrice: number | null) => (<div className="text-sm pt-1 px-1 flex items-center justify-between space-x-1">
  <div>
    <GoldCount size="xs" count={sellPrice} />
  </div>
  <div className="h-4 border-r border-gray-300" />
  <div>
  {dropRate ?? '?'}<span className="pl-0.5">%</span>
  </div>
</div> )

  return (<div className={cn("flex flex-wrap items-center", size === 'md' ? 'gap-4' : 'gap-2' , className)}>
    {drops.map(d => <div key={d.itemId}><TooltipProvider>
      <Tooltip delayDuration={0}>
        <TooltipTrigger className="block">
          <Link href={`/items/${d.item.slug}`}>
            <ItemSprite
              className="border-2 shadow-sm border-slate-200 bg-slate-50 rounded-sm"
              url={d.item.spriteUrl}
              name={d.item.name}
              size={size}
            />
          </Link>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <div>{d.item.name}</div>
          {infoInToolTip ? getItemInfo(d.dropRate, d.item.sellPrice) : null}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
      {!infoInToolTip ? getItemInfo(d.dropRate, d.item.sellPrice) : null}
    </div>
    )}
  </div>);

}
