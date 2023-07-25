'use client';
import { GoldCount } from "~/components/GoldCount";

export function DropGold({ goldMin, goldMax, className }: { goldMin: number; goldMax: number; className?: string; }) {
  return <GoldCount count={goldMax === goldMin ? goldMin : `${goldMin}-${goldMax}`} className={className} />
}
