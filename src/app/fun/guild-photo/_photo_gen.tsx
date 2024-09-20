"use client";

import { useRef, useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";
import type { GuildMember } from "~/features/guilds/utils";
import { api } from "~/trpc/react";

function GuildLookup({
	onSubmit,
	disabled,
}: { onSubmit: (name: string) => void; disabled?: boolean }) {
	const [name, setName] = useState("");

	return (
		<div>
			<Input
				disabled={disabled}
				value={name}
				onChange={(e) => setName(e.target.value)}
			/>
			<Button disabled={disabled} onClick={() => onSubmit(name)}>
				Submit
			</Button>
		</div>
	);
}

function GuildPhotoGen({
	data,
	guildName,
}: { data: GuildMember[]; guildName: string }) {
	const imageRef = useRef<HTMLImageElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);

	const { data: areas } = api.area.getAll.useQuery();

	const [selectedArea, setSelectedArea] = useState(areas?.[0]);

	const area = selectedArea ?? areas?.[0];

	const onDownload = () => {
		const canvas = canvasRef.current;
		const ctx = canvas?.getContext("2d");
		if (!canvas || !ctx) {
			return;
		}

		const dataUrl = canvas.toDataURL("image/png");
		const link = document.createElement("a");
		link.download = `${guildName}.png`;
		link.href = dataUrl;
		link.click();
	};

	return (
		<div>
			<Select
				value={area?.id}
				onValueChange={(id) => setSelectedArea(areas?.find((a) => a.id === id))}
			>
				<SelectTrigger>
					<SelectValue placeholder="Select Area" />
				</SelectTrigger>
				<SelectContent>
					{areas?.map((area) => (
						<SelectItem key={area.id} value={area.id}>
							{area.name}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
			<img
				ref={imageRef}
				src={area?.spriteUrl ?? ""}
				alt="area"
				onLoad={(e) => {
					const canvas = canvasRef.current;
					const ctx = canvas?.getContext("2d");
					if (!canvas || !ctx) {
						return;
					}

					ctx.drawImage(e.currentTarget, 0, 0);
				}}
				className="hidden"
			/>

			<div className="max-w-screen-md">
				<canvas ref={canvasRef} id="canvas" className="aspect-[4/3] w-full" />
			</div>
			<div>
				<Button onClick={onDownload}>Download</Button>
			</div>
		</div>
	);
}

export function PhotoGen() {
	const [guildName, setGuildName] = useState("");
	const { data, isFetching } = api.guild.findGuild.useQuery(guildName, {
		enabled: !!guildName,
	});

	return (
		<div>
			<GuildLookup onSubmit={setGuildName} disabled={isFetching} />

			{data && <GuildPhotoGen data={data} guildName={guildName} />}
		</div>
	);
}
