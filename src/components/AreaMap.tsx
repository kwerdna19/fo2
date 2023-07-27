'use client'

import { type RouterOutputs } from "~/utils/api";
import { ImageOverlay, LayerGroup, LayersControl, MapContainer, Marker, Popup, useMapEvent } from "react-leaflet"
import * as L from "leaflet";
import { spriteWidth, spriteHeight } from "./MobSprite";
import { useState } from "react";


function MapBackground({ url, height, width }: { url: string, height: number, width: number }) {
  const [className, setClassName] = useState("")
  const map = useMapEvent('zoom', () => {
    setClassName(map.getZoom() >= 0 ? 'pixelated' : '')
  })
  return (<ImageOverlay key={className} className={className} url={url} bounds={[[0,0], [height,width]]} />)
}

type Area = NonNullable<RouterOutputs['area']['getBySlug']>

export default function AreaMap({ area }: { area: Area }) {

  const { spriteUrl: url, height, width, locations } = area

  const mobs = locations.filter(l => l.mob && l.mobId).map(l => ({...l.mob!, x: l.x, y: l.y}))

  return (<>
  <MapContainer
      center={[height/2,width/2]}
      maxBounds={[[0,0], [height,width]]}
      maxBoundsViscosity={1}
      minZoom={-2}
      maxZoom={1}
      zoom={-2}
      crs={L.CRS.Simple}
      className="border border-slate-500 flex-1 rounded-md w-full min-h-[24rem] box-border"
      style={{
        maxHeight: height/4,
        maxWidth: width/4
      }}
    >
      <MapBackground url={url} height={height} width={width} />
      <LayersControl position="topright">

      <LayersControl.Overlay checked name="Mobs">
        <LayerGroup>
          {
            mobs.map(mob => {
              return <Marker
              key={mob.id}
              position={[mob.y, mob.x]}
              alt={mob.name}
              icon={
                L.divIcon({
                  html: `<div id="${mob.id}" style="background-image: url(${mob.spriteUrl})"></div>`,
                  className: "pixelated map-sprite-icon",
                  iconSize: [spriteWidth*2, spriteHeight*2],
                })
              }
              >
                <Popup>
                  <div>{mob.name}</div>
                </Popup>
              </Marker>
            })
          }
        </LayerGroup>
      </LayersControl.Overlay>
        

        
      </LayersControl>
  </MapContainer></>)
}