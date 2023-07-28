'use client';
import { LayerGroup, LayersControl, Marker, Popup } from "react-leaflet";
import * as L from "leaflet";
import { spriteWidth, spriteHeight } from "../MobSprite";
import { type RouterOutputs } from "~/utils/api";
import { DropsList } from "../tables/mobs/DropsList";
import Link from "next/link";

type Locations = NonNullable<RouterOutputs['area']['getBySlug']>['locations']

export function LocationLayers({ id, locations }: { id: string; locations: Locations; }) {

  const mobs = locations.filter(l => l.mob && l.mobId).map(l => ({ ...l.mob!, x: l.x, y: l.y }));

  return (<LayersControl position="topright">
    <LayersControl.Overlay checked name="Mobs">
      <LayerGroup>
        {mobs.map(mob => {
          return <Marker
            key={mob.id}
            position={[mob.y, mob.x]}
            alt={mob.name}
            icon={L.divIcon({
              html: `<div id="${id}-${mob.id}" style="background-image: url(${mob.spriteUrl})"></div>`,
              className: "pixelated map-sprite-icon",
              iconSize: [spriteWidth * 2, spriteHeight * 2],
            })}
          >
            <Popup minWidth={56*(mob.drops.length || 1) + 8}>
              <div className="p-2 pt-1">
                <Link href={`/mobs/${mob.slug}`} className="text-sm font-bold">
                  {mob.name}
                </Link>
                <DropsList className="mt-2" size="sm" drops={mob.drops} infoInToolTip />
              </div>
            </Popup>
          </Marker>;
        })}
      </LayerGroup>
    </LayersControl.Overlay>
  </LayersControl>);


}
