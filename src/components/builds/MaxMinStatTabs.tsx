'use client';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "~/components/ui/tabs";
import BuildAndStats from "./BuildAndStats";
import { LEVEL_CAP } from '../../utils/fo';
import { type Data } from "./MaxMinBuildsPage";

const stats = ['str', 'agi', 'sta', 'int', 'armor'] as const;
export function MaxMinStatTabs({ data, type }: { data: Data; type: 'min' | 'max'; }) {

  return (<Tabs defaultValue={stats[0]}>
    <TabsList className="grid w-full grid-cols-5 max-w-sm mx-auto mb-6">
      {stats.map(stat => <TabsTrigger key={stat} value={stat}>{stat.toUpperCase()}</TabsTrigger>)}
    </TabsList>
    {stats.map(stat => {
      const d = data[stat];
      return (<TabsContent key={stat} value={stat}>
        {d ? <BuildAndStats items={d} opt={type} stat={stat} level={LEVEL_CAP} /> : <div>No Data</div>}
      </TabsContent>);
    })}
  </Tabs>);
}
