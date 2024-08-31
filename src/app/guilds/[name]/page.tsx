import { format } from "date-fns";
import { User } from "lucide-react";
import { notFound } from "next/navigation";
import { MobSprite } from "~/components/MobSprite";
import { PriceDisplay } from "~/components/PriceDisplay";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";
import { TooltipProvider } from "~/components/ui/tooltip";
import { env } from "~/env";
import { getPlayerSpriteUrl, guildRankMap } from "~/utils/fo";
import { GuildService } from "~/utils/fo-api";

interface Params {
	name: string;
}

export async function generateMetadata({ params }: { params: Params }) {
	return {
		title: `Guilds | ${decodeURI(params.name)}`,
	};
}

const xApiKey = env.FO_API_KEY;

export const revalidate = 3600;

export async function generateStaticParams() {
	const guilds = await GuildService.getGuildLeaderboard({ xApiKey });
	const params = guilds.map((g) => ({
		name: g.Name,
	}));
	return params;
}

export default async function Guild({ params }: { params: Params }) {
	const name = decodeURI(params.name);
	const info = await GuildService.getGuildDetails({
		xApiKey,
		requestBody: { name },
	}).catch(() => null);

	if (!info) {
		notFound();
	}

	const [members, leaderBoard] = await Promise.all([
		GuildService.getGuildMembers({
			xApiKey,
			requestBody: { name },
		}),
		GuildService.getGuildLeaderboard({
			xApiKey,
		}),
	]);

	const byRank = members.reduce(
		(acc, val) => {
			if (val.GuildRank) {
				acc[val.GuildRank] = [...(acc[val.GuildRank] ?? []), val];
			}
			return acc;
		},
		{} as Record<
			string,
			Array<
				Partial<{
					Name: string;
					Level: number;
					Sprite: string;
				}>
			>
		>,
	);

	const groups = Object.keys(guildRankMap)
		.map((r) => {
			return {
				rankId: Number(r),
				rank: (guildRankMap as Record<string, string>)[r],
				members: (byRank[r] ?? []).sort(
					(a, b) =>
						a.Name?.toLowerCase().localeCompare(
							b.Name?.toLowerCase() as string,
						) ?? 0,
				),
			};
		})
		.sort((a, b) => b.rankId - a.rankId)
		.filter((g) => g.members.length > 0);

	const rank = leaderBoard.findIndex((l) => l.Name === info.Name) + 1;

	return (
		<TooltipProvider>
			<div className="w-full space-y-8">
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
				<div className="flex gap-4 items-center h-4">
					<PriceDisplay
						count={info.TotalDonations ?? "?"}
						notation="standard"
					/>
					<Separator orientation="vertical" />
					<div className="flex gap-2 items-center">
						<div>Lv</div> <div>{info.Level ?? "?"}</div>
					</div>
					<Separator orientation="vertical" />

					<div className="flex gap-2 items-center">
						<User className="h-4 w-4" /> {info.NumMembers ?? "?"}
					</div>
				</div>
				{/* <Tooltip>
					<TooltipTrigger className="text-3xl hover:text-foreground cursor-default">
						
					</TooltipTrigger>
					<TooltipContent side="bottom">
						<p>Hail Delta!</p>
					</TooltipContent>
				</Tooltip> */}
				<div className="space-y-10 max-w-screen-md w-full pb-8">
					{groups.map(({ rankId, rank, members }) => {
						return (
							<div key={rankId}>
								<div className="font-bold">{rank}</div>
								<div className="flex flex-wrap gap-x-5 gap-y-3">
									{members.map((m) => (
										<div key={m.Name} className="flex flex-col items-center">
											<MobSprite
												size="md"
												className="-mb-6 -mt-4"
												url={getPlayerSpriteUrl(m.Sprite as string)}
												name={m.Name as string}
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
		</TooltipProvider>
	);
}
