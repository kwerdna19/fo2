import { ItemSprite } from "~/components/ItemSprite";
import NavCard from "~/components/NavCard";
import { Sprite } from "~/components/Sprite";

export default function App() {
	return (
		<div className="w-full flex flex-col items-center py-12 space-y-4">
			<NavCard
				href="/mobs"
				label="Mobs"
				image={
					<Sprite
						type="MOB"
						size="sm"
						url="enemy-crab"
						className="-mt-6 -ml-2"
					/>
				}
			/>
			<NavCard
				href="/items"
				label="Items"
				image={
					<ItemSprite
						size="sm"
						url="https://art.fantasyonline2.com/textures/icons/items/backpack-large-icon.png"
					/>
				}
			/>
			<NavCard
				href="/npcs"
				label="Npcs"
				image={
					<Sprite
						type="NPC"
						size="sm"
						url="npc-storage-001"
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
				href="/guilds"
				label="Guilds"
				image={
					<ItemSprite
						size="sm"
						url="/sprites/misc-ui/guildmenu-icon.png"
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
