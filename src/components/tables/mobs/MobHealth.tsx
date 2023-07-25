'use client';
import { cn } from "~/utils/styles";
import { GiHealthNormal as Health } from 'react-icons/gi';

export function MobHealth({ health, className }: { health: number; className?: string; }) {
  return <div className={cn(className, "flex justify-center items-center gap-x-2")}>
    <Health className="text-red-500 w-4 h-4" /><div>{health}</div>
  </div>;
}
