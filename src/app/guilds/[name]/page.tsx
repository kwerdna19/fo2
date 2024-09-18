import { format } from "date-fns";
import { User } from "lucide-react";
import { notFound } from "next/navigation";
import { PriceDisplay } from "~/components/PriceDisplay";
import { Sprite } from "~/components/Sprite";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";
import { groupGuildMembers } from "~/features/guilds/utils";
import { foApi } from "~/utils/fo-api";
import { getPlayerSpriteUrl, guildRankMap } from "~/utils/fo-game";

interface Params {
	name: string;
}

export async function generateMetadata({ params }: { params: Params }) {
	return {
		title: `Guilds | ${decodeURI(params.name)}`,
	};
}

export const revalidate = 1800;

export async function generateStaticParams() {
	const result = await foApi.GET("/api/public/guild/leaderboard");
	if (result.error) {
		return [];
	}
	const params = result.data.map((g) => ({
		name: g.Name,
	}));
	return params;
}

export default async function Guild({ params }: { params: Params }) {
	const name = decodeURI(params.name);
	const result = await foApi.POST("/api/public/guild", {
		body: { name },
	});

	if (result.error) {
		notFound();
	}

	const info = result.data;

	const [members, leaderBoard] = await Promise.all([
		foApi
			.POST("/api/public/guild/members", {
				body: { name },
			})
			.then((r) => {
				if (r.error) {
					throw new Error("Error fetching guild members");
				}
				return r.data;
			}),
		foApi.GET("/api/public/guild/leaderboard").then((r) => {
			if (r.error) {
				throw new Error("Error fetching guild leaderboard");
			}
			return r.data;
		}),
	]);

	const groups = groupGuildMembers(members).filter((g) => g.members.length > 0);

	const rank = leaderBoard.findIndex((l) => l.Name === info.Name) + 1;

	const estDate = info.Approved ? format(new Date(info.Approved), "PP") : null;
	const today = format(new Date(), "PP");

	return (
		<div className="w-full space-y-8">
			<div className="space-y-2">
				<div className="flex gap-4 text-3xl">
					<h2>
						{info.Name}
						{info.Name === "Delta" ? " Δ" : ""}
					</h2>
					{rank > 0 ? (
						<Badge className="text-lg items-center">
							<span className="text-base font-normal mr-1">#</span>
							{rank}
						</Badge>
					) : null}
				</div>
				<div className="text-sm text-muted-foreground">
					Est. {estDate ?? "?"}
					{estDate === today ? <span> 🎂</span> : null}
				</div>
			</div>
			<div className="flex gap-4 items-center h-4">
				<PriceDisplay count={info.TotalDonations ?? "?"} notation="standard" />
				<Separator orientation="vertical" />
				<div className="flex gap-2 items-center">
					<div>Lv</div> <div>{info.Level ?? "?"}</div>
				</div>
				<Separator orientation="vertical" />

				<div className="flex gap-2 items-center">
					<User className="h-4 w-4" /> {info.NumMembers ?? "?"}
				</div>
			</div>
			<div className="space-y-10 max-w-screen-md w-full pb-8">
				{groups.map(({ rankId, rank, members }) => {
					return (
						<div key={rankId}>
							<div className="font-bold">{rank}</div>
							<div className="flex flex-wrap gap-x-5 gap-y-3">
								{members.map((m) => (
									<div key={m.Name} className="flex flex-col items-center">
										<Sprite
											type="PLAYER"
											size="md"
											className="-mb-6 -mt-4"
											url={m.Sprite as string}
										/>
										<div>{m.Name}</div>
									</div>
								))}
							</div>
						</div>
					);
				})}
			</div>

			<p className="text-sm text-muted-foreground px-2">
				Last Updated: {format(new Date(), "Pp")}
			</p>
		</div>
	);
}
