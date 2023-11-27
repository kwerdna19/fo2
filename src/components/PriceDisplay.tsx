'use client';
import { cn } from "~/utils/styles";
import { UnitSprite } from "./UnitSprite";
import { type Unit } from "@prisma/client";

const formatter = Intl.NumberFormat('en-US', {
  notation: "compact",
  maximumFractionDigits: 2
})

export function PriceDisplay({ count, className, size = 'sm', unit = 'COINS' }: { count: number | null | string; className?: string; size?: 'sm' | 'xs', unit?: Unit }) {
  if(count === null) {
    return null
  }

  const getDisplay = () => {
    if(typeof count === 'string') {
      return count
    }
    return formatter.format(count)
  }


  return (<div className={cn(className, "flex items-center", size === 'xs' ? 'gap-x-1' : 'gap-x-2')}>
    <UnitSprite type={unit} size={size} />{getDisplay()}
  </div>);
}
