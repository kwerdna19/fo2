'use client';
import { cn } from "~/utils/styles";
import { type Item } from "@prisma/client";
import { type BasicStats } from "~/utils/fo";

export function ItemStats(props: { stats: Pick<Item, BasicStats>; className?: string; }) {


  const { className, stats: inputItem } = props;

  const armor = inputItem.armor;

  const stats = (['str', 'agi', 'int', 'sta'] as const).filter(s => inputItem[s] !== null).map(s => {
    return {
      stat: s.toUpperCase(),
      value: inputItem[s]!
    };
  });
  //.sort((a, b) => b.value - a.value)
  if (stats.length === 0 && !armor) {
    return null;
  }

  return (<div className={cn(className, "text-sm")}>
    {stats.length > 0 ? <div className="bg-slate-200 dark:bg-slate-600 w-16 space-y-1.5 rounded-md p-1 mb-1">
      {stats.map(({ stat, value }) => {
        return (<div key={stat} className="flex justify-between">
          <div className="bg-slate-300 dark:bg-slate-700 w-6 text-center rounded-sm">{value > 0 ? `+${value}` : value}</div>
          <div className="flex-1 text-center pl-1">{stat}</div>
        </div>);
      })}
    </div> : null}
    {armor ? <div className="p-1"><span>{armor > 0 ? `+${armor}` : armor}</span> <span>Armor</span></div> : null}
  </div>);

}
