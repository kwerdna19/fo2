"use client";

import { type Item } from "@prisma/client";
import { type BasicStats } from "~/utils/fo";
import { MaxMinStatTabs } from "./MaxMinStatTabs";

export type Data = Record<BasicStats, Item[] | undefined>;

interface Props {
	maxes: Data;
	mins: Data;
}

export default function MaxMinBuildsPage(props: Props) {
	const { maxes } = props;

	return (
		<div className="w-full flex justify-center">
			<MaxMinStatTabs data={maxes} type="max" />

			{/* <Tabs defaultValue="max">
    <TabsList className="grid w-full grid-cols-2 max-w-sm mx-auto">
      <TabsTrigger value="max">Max</TabsTrigger>
      <TabsTrigger value="min">Min</TabsTrigger>
    </TabsList>
    <TabsContent value="max">
      <MaxMinStatTabs data={maxes} type="max" />
    </TabsContent>
    <TabsContent value="min">
      <MaxMinStatTabs data={mins} type="min" />
    </TabsContent>
  </Tabs> */}
		</div>
	);
}
