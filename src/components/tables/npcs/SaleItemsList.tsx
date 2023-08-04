'use client';
import { cn } from "~/utils/styles";
import { ItemSprite } from "../../ItemSprite";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "~/components/ui/tooltip";
import { type Datum } from "./NpcTable";
import Link from "next/link";
import { GoldCount } from "~/components/GoldCount";

export function SaleItemsList({ items, className, infoInToolTip = false, size = 'md' }: { items: Datum['items']; className?: string; infoInToolTip?: boolean, size?: 'md' | 'sm' }) {


  const getItemInfo = (salePrice: number | null) => {

    if(!salePrice) {
      return null
    }

    return ((<div className="text-sm pt-1 px-1 flex items-center justify-between space-x-1">
    <div>
      <GoldCount size="xs" count={salePrice} />
    </div>
  </div>))
  }

  return (<div className={cn("flex flex-wrap items-center", size === 'md' ? 'gap-4' : 'gap-2' , className)}>
    {items.map(d => <div key={d.itemId}><TooltipProvider>
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
          {infoInToolTip ? getItemInfo(d.price) : null}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
      {!infoInToolTip ?getItemInfo(d.price) : null}
    </div>
    )}
  </div>);

}
