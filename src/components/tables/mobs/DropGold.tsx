'use client';
import { cn } from "~/utils/styles";
import { UnitSprite } from "../../UnitSprite";

export function DropGold({ goldMin, goldMax, className }: { goldMin: number; goldMax: number; className?: string; }) {

  return (<div className={cn(className, "flex flex-row-reverse items-center gap-x-2")}>
    {goldMax === goldMin ? goldMin : `${goldMin}-${goldMax}`}<UnitSprite type="coin" size="sm" /></div>);
}
