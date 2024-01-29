"use client";
import * as L from "leaflet";
import { Marker, useMapEvents } from "react-leaflet";

const LocationInput = ({
	onChange,
	value,
}: {
	onChange: (coords: { x: number; y: number } | undefined) => void;
	value: { x: number; y: number } | undefined;
}) => {
	const { x, y } = value ?? {};
	const hasValue = x !== undefined && y !== undefined;

	useMapEvents({
		click: (e) => {
			onChange({
				x: Math.round(e.latlng.lng),
				y: Math.round(e.latlng.lat),
			});
		},
		contextmenu: (e) => {
			e.originalEvent.preventDefault();
		},
	});

	if (!hasValue) {
		return null;
	}

	return (
		<Marker
			position={[y, x]}
			icon={L.divIcon({
				className: "bg-transparent",
				html: '<div class="location-input-selection"></div>',
				iconSize: [24, 24],
				iconAnchor: [24 / 2, 24 - 1],
			})}
		>
			{/* <Popup>
    <div className="p-4">
      ({x},{y})
    </div>
  </Popup> */}
		</Marker>
	);
};

export default LocationInput;
