import { ItemSprite } from "~/components/ItemSprite";
import { MobSprite } from "~/components/MobSprite";
import NavCard from "~/components/NavCard";


export default function App() {


  return <div className="w-full flex flex-col items-center py-12 space-y-6">
    <NavCard
      href="/mobs"
      label="Mobs"
      image={<MobSprite size="md" url="/sprites/mob/soft_shelled_crab.png" name="crab" className="-mt-12 -mb-4 -ml-2 -mr-2" />}
    />
    <NavCard
      href="/items"
      label="Items"
      image={<ItemSprite size="md" url="/sprites/item/weapons-sword-long-icon.png" name="long sword" />}
    />
    <NavCard
      href="/npcs"
      label="Npcs"
      image={<MobSprite size="md" url="/sprites/npc/npc-storage-001q87.png" name="zutroy" className="-mt-12 mb-5 -ml-2 -mr-2" />}
    />
  </div>
}