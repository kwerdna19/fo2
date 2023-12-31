'use client';
import { cn } from "~/utils/styles";
import { GiHealthNormal as Health } from 'react-icons/gi';

export function MobHealth({ health, className, iconClassName }: { health: number; className?: string; iconClassName?: string }) {
  return <div className={cn("flex justify-center items-center gap-x-2", className)}>
    <Health className={cn("text-red-500 w-4 h-4", iconClassName)} /><div>{health}</div>
  </div>;
}
