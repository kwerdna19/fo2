import { User } from "lucide-react";
import Link from "next/link";
import { PriceDisplay } from "~/components/PriceDisplay";
import { Card } from "~/components/ui/card";
import { env } from "~/env";
import { GuildService } from "~/utils/fo-api";

export const metadata = {
	title: "Guilds",
};

const xApiKey = env.FO_API_KEY;

export default async function Guilds() {
	const topGuilds = await GuildService.getGuildLeaderboard({ xApiKey });

	const guildDetails = await Promise.all(
		topGuilds.map((g) =>
			GuildService.getGuildDetails({
				xApiKey,
				requestBody: { name: g.Name },
			}),
		),
	);

	return (
		<div className="w-full space-y-8">
			<div className="flex gap-x-4">
				<h2 className="text-3xl">Guilds</h2>
			</div>
			<div className="space-y-3 max-w-screen-sm w-full pb-8">
				{topGuilds.map((g, i) => {
					const details = guildDetails[i];

					return (
						<Link
							prefetch={false}
							href={`/guilds/${encodeURI(g.Name as string)}`}
							key={g.Name}
							className="block"
						>
							<Card className="px-4 py-3 flex items-center gap-5">
								<div className="text-2xl px-3">{i + 1}</div>
								<div className="flex-1">
									<div className="text-xl">{g.Name}</div>
									<div className="flex gap-5">
										<PriceDisplay count={details?.TotalDonations ?? "?"} />
										<div className="text-muted-foreground">Lv. {g.Level}</div>
									</div>
								</div>
								<div className="text-muted-foreground flex items-center gap-2">
									{details?.NumMembers ?? "?"}
									<User />
								</div>
							</Card>
						</Link>
					);
				})}
			</div>
		</div>
	);
}
