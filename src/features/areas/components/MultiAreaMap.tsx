"use client";

import * as L from "leaflet";
import { useState } from "react";
import { MapContainer } from "react-leaflet";
import { type getAllAreasPopulated } from "../requests";
import { MapBackground } from "./MapBackground";

type Areas = Awaited<ReturnType<typeof getAllAreasPopulated>>;

export default function MultiAreaMap({
	areas: allAreas,
	bg,
}: { areas: Areas; bg?: string }) {
	const [region] = useState(allAreas.at(0)?.region);

	const areas = allAreas.filter((a) => a.region === region);

	const maxX = areas.reduce((acc, area) => {
		if (area.originXGlobal + area.width > acc) {
			// biome-ignore lint/style/noParameterAssign: array reduce
			acc = area.originXGlobal + area.width;
		}
		return acc;
	}, 0);

	const maxY = areas.reduce((acc, area) => {
		if (area.originYGlobal + area.height > acc) {
			// biome-ignore lint/style/noParameterAssign: array reduce
			acc = area.originYGlobal + area.height;
		}
		return acc;
	}, 0);

	const firstArea = areas.at(0);

	if (!firstArea) {
		return null;
	}

	return (
		<MapContainer
			center={[firstArea.height / 2, firstArea.width / 2]}
			maxBounds={[
				[0, 0],
				[maxY, maxX],
			]}
			maxBoundsViscosity={1}
			minZoom={-2}
			maxZoom={1}
			zoom={-2}
			crs={L.CRS.Simple}
			className="border shadow-lg border-slate-500 flex-1 rounded-md w-full max-w-screen-lg min-h-[24rem] box-border"
			style={{
				maxHeight: 600,
				backgroundColor: bg,
				zIndex: 0,
			}}
		>
			{areas.map((area) => (
				<MapBackground
					key={area.id}
					url={area.spriteUrl}
					height={area.height}
					width={area.width}
					x={area.originXGlobal}
					y={area.originYGlobal}
				/>
			))}
		</MapContainer>
	);
}
