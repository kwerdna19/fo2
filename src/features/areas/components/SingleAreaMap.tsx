"use client";

import * as L from "leaflet";
import type { ReactNode } from "react";
import { MapContainer } from "react-leaflet";
import type { RouterOutputs } from "~/trpc/react";
import { cn } from "~/utils/styles";
import { LocationLayers } from "./LocationLayers";
import { MapBackground } from "./MapBackground";

type Area = NonNullable<RouterOutputs["area"]["getBySlug"]>;

export default function SingleAreaMap({
	area,
	className,
	children,
}: {
	area: Pick<Area, "id" | "spriteUrl" | "height" | "width"> & {
		locations?: Area["locations"];
	};
	className?: string;
	children?: ReactNode;
}) {
	const { spriteUrl: url, height, width, locations } = area;

	return (
		<MapContainer
			center={[height / 2, width / 2]}
			maxBounds={[
				[0, 0],
				[height, width],
			]}
			maxBoundsViscosity={1}
			minZoom={-2}
			maxZoom={1}
			zoom={-2}
			crs={L.CRS.Simple}
			className={cn(
				"border border-slate-500 flex-1 rounded-md w-full max-w-screen-lg min-h-[44rem] box-border",
				className,
			)}
			style={{
				maxHeight: height / 4,
				zIndex: 0,
			}}
		>
			{children}
			<MapBackground url={url} height={height} width={width} />
			{locations && locations.length > 0 ? (
				<LocationLayers id={area.id} locations={locations} />
			) : null}
		</MapContainer>
	);
}
