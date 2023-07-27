'use client';
import { LayerGroup, LayersControl, Marker, Popup } from "react-leaflet";
import * as L from "leaflet";
import { spriteWidth, spriteHeight } from "../MobSprite";
import { RouterOutputs } from "~/utils/api";

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
            <Popup>
              <div>{mob.name}</div>
            </Popup>
          </Marker>;
        })}
      </LayerGroup>
    </LayersControl.Overlay>
  </LayersControl>);


}
