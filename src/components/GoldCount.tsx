'use client';
import { cn } from "~/utils/styles";
import { UnitSprite } from "./UnitSprite";

const formatter = Intl.NumberFormat('en-US', {
  notation: "compact",
  maximumFractionDigits: 2
})

export function GoldCount({ count, className, size = 'sm' }: { count: number | null | string; className?: string; size?: 'sm' | 'xs' }) {
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
    <UnitSprite type="coin" size={size} />{getDisplay()}
  </div>);
}
