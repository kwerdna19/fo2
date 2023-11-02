'use client';
import { ImageOverlay, useMapEvent } from "react-leaflet";
import { useState } from "react";

export function MapBackground({ url, height, width, x = 0, y = 0 }: { url: string; height: number; width: number; x?: number; y?: number }) {
  const [className, setClassName] = useState("");
  const map = useMapEvent('zoom', () => {
    setClassName(map.getZoom() >= 0 ? 'pixelated' : '');
  });

  return (<ImageOverlay key={className} className={className} url={url} bounds={[[y, x], [y + height, x + width]]} />);
}
