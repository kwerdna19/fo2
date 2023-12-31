'use client';
import { cn } from "~/utils/styles";
import { type Item } from "@prisma/client";
import { type RequiredStats } from "~/utils/fo";

export function ItemRequiredStats(props: { stats: Pick<Item, RequiredStats>; className?: string; }) {


  const { className, stats: inputItem } = props;

  const stats = (['reqStr', 'reqAgi', 'reqInt', 'reqSta'] as const).filter(s => inputItem[s] !== null).map(s => {
    return {
      stat: s.replace('req', '').toUpperCase(),
      value: inputItem[s]!
    };
  });
  //.sort((a, b) => b.value - a.value)
  if (stats.length === 0) {
    return null;
  }

  return (<div className={cn(className, "text-sm bg-amber-200 w-16 space-y-1.5 rounded-md p-1 mb-1")}>
      {stats.map(({ stat, value }) => {
        return (<div key={stat} className="flex justify-between">
          <div className="bg-amber-300 w-6 text-center rounded-sm">{value}</div>
          <div className="flex-1 text-center pl-1">{stat}</div>
        </div>);
      })}
  </div>);

}
