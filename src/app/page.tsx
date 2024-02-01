import { ItemSprite } from "~/components/ItemSprite";
import { MobSprite } from "~/components/MobSprite";
import NavCard from "~/components/NavCard";

export default function App() {
	return (
		<div className="w-full flex flex-col items-center py-12 space-y-4">
			<NavCard
				href="/mobs"
				label="Mobs"
				image={
					<MobSprite
						size="sm"
						url="/sprites/mob/soft_shelled_crab.png"
						name="crab"
						className="-mt-6 -ml-2"
					/>
				}
			/>
			<NavCard
				href="/items"
				label="Items"
				image={
					<ItemSprite size="sm" url="/sprites/item/backpack-large-icon.png" />
				}
			/>
			<NavCard
				href="/npcs"
				label="Npcs"
				image={
					<MobSprite
						size="sm"
						url="/sprites/npc/npc-storage-001q87.png"
						className="-mt-12 -ml-2"
					/>
				}
			/>
			<NavCard
				href="/skills"
				label="Skills"
				image={
					<ItemSprite
						size="sm"
						url="/sprites/misc-ui/skillbook-icon.png"
						menuSprite
					/>
				}
			/>
			<NavCard
				href="/battlepass"
				label="Battlepass"
				image={
					<ItemSprite
						size="sm"
						url="/sprites/misc-ui/battlepasswindow-icon.png"
						menuSprite
					/>
				}
			/>
		</div>
	);
}
