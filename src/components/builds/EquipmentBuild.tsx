// "use client";

// import type { Item } from "@prisma/client";
// import {
// 	type Build,
// 	type NonCosmeticEquippableType,
// 	type Slot,
// 	equipmentSlotConfig,
// 	playerSlots,
// } from "~/utils/fo-game";
// import { BuildItem } from "./BuildItem";
// import { CharacterPreview } from "./CharacterPreview";

// interface Props {
// 	items: Item[];
// 	build: Build;
// 	updateSlot: (slot: Slot, newItemId: string | null | undefined) => void;
// 	health?: number;
// 	energy?: number;
// }

// export default function EquipmentBuild({
// 	build,
// 	updateSlot,
// 	energy,
// 	health,
// 	items,
// }: Props) {
// 	return (
// 		<div className="grid grid-cols-[1fr_400px_1fr] gap-4 grid-rows-7">
// 			{playerSlots.map((slot, i) => {
// 				const row = (i % 7) + 1;
// 				const col = i < 7 ? 1 : 3;

// 				if (slot === null) {
// 					return <div key={slot} style={{ gridRow: row, gridColumn: col }} />;
// 				}
// 				const item = build[slot];

// 				const options = items
// 					.filter((item) => {
// 						if (item.equip === null) {
// 							return false;
// 						}
// 						const slotOrSlots =
// 							equipmentSlotConfig[item.equip as NonCosmeticEquippableType];

// 						if (Array.isArray(slotOrSlots)) {
// 							return slotOrSlots.includes(slot);
// 						}

// 						return slotOrSlots === slot;
// 					})
// 					.sort((a, b) => (a.levelReq ?? 0) - (b.levelReq ?? 0));

// 				return (
// 					<div key={slot} style={{ gridRow: row, gridColumn: col }}>
// 						<BuildItem
// 							slot={slot}
// 							item={item}
// 							tooltipSide={col === 1 ? "left" : "right"}
// 							options={options}
// 							updateItem={(newItemId) => updateSlot(slot, newItemId)}
// 						/>
// 					</div>
// 				);
// 			})}
// 			<div className="border col-start-2 col-end-2 row-span-full flex items-center justify-center rounded-sm relative">
// 				<CharacterPreview build={build} className="-mt-4" />

// 				<div className="absolute bottom-0 w-full flex flex-col sm:flex-row p-5 gap-x-5 gap-y-3">
// 					<div className="flex-1 flex items-center bg-blue-600 border-2 border-black text-white px-2 justify-between rounded-sm">
// 						<div className="pb-0.5">Energy</div>
// 						<div>
// 							{energy}/{energy}
// 						</div>
// 					</div>

// 					<div className="flex-1 flex items-center bg-red-600 border-2 border-black text-white px-2 justify-between rounded-sm">
// 						<div className="pb-0.5">Health</div>
// 						<div>
// 							{health}/{health}
// 						</div>
// 					</div>
// 				</div>
// 			</div>
// 		</div>
// 	);
// }
