"use client";

import * as L from "leaflet";
import { useState } from "react";
import { MapContainer } from "react-leaflet";
import type { RouterOutputs } from "~/trpc/react";
import { MapBackground } from "./MapBackground";

type Areas = RouterOutputs["area"]["getAllPopulated"]["data"];

export default function MultiAreaMap({
	areas: inputAreas,
	bg,
}: { areas: Areas; bg?: string }) {
	const areas = inputAreas.filter((a) => a.spriteUrl) as Array<
		Omit<Areas[number], "spriteUrl"> & { spriteUrl: string }
	>;

	const maxX = areas.reduce((acc, area) => {
		if (area.globalX + area.width > acc) {
			// biome-ignore lint/style/noParameterAssign: array reduce
			acc = area.globalX + area.width;
		}
		return acc;
	}, 0);

	const maxY = areas.reduce((acc, area) => {
		if (area.globalY + area.height > acc) {
			// biome-ignore lint/style/noParameterAssign: array reduce
			acc = area.globalY + area.height;
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
			className="border shadow-lg border-slate-500 flex-1 rounded-md w-full max-w-screen-xl min-h-[48rem] box-border"
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
					x={area.globalX}
					y={area.globalY}
				/>
			))}
		</MapContainer>
	);
}
