'use client';
import { cn } from "~/utils/styles";
import { UnitSprite } from "./UnitSprite";
import { type ReactNode } from "react";

export function GoldCount({ count, className }: { count: ReactNode; className?: string; }) {
  return (<div className={cn(className, "flex items-center gap-x-2")}>
    <UnitSprite type="coin" size="sm" />{count}
  </div>);
}
