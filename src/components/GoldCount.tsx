'use client';
import { cn } from "~/utils/styles";
import { UnitSprite } from "./UnitSprite";
import { type ReactNode } from "react";

export function GoldCount({ count, className, size = 'sm' }: { count: ReactNode; className?: string; size?: 'sm' | 'xs' }) {
  if(!count) {
    return null
  }
  return (<div className={cn(className, "flex items-center", size === 'xs' ? 'gap-x-1' : 'gap-x-2')}>
    <UnitSprite type="coin" size={size} />{count}
  </div>);
}
