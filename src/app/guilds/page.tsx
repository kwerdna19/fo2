import { format } from "date-fns";
import { User } from "lucide-react";
import Link from "next/link";
import { PriceDisplay } from "~/components/PriceDisplay";
import { Card } from "~/components/ui/card";
import { foApi } from "~/utils/fo-api";

export const metadata = {
	title: "Guilds",
};

export const revalidate = 1800;

export default async function Guilds() {
	const result = await foApi.GET("/api/public/guild/leaderboard");
	if (result.error) {
		throw new Error("Error fetching guild leaderboard");
	}

	const guildDetails = await Promise.all(
		result.data.map((g) =>
			foApi
				.POST("/api/public/guild", {
					body: { name: g.Name },
				})
				.then((r) => {
					if (r.error) {
						throw new Error("Error fetching guild details");
					}
					return r.data;
				}),
		),
	);

	return (
		<div className="w-full">
			<div className="pb-4">
				<h2 className="text-3xl">Guilds</h2>
			</div>
			<div className="space-y-3 max-w-screen-sm w-full pb-8">
				{result.data.map((g, i) => {
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
										<PriceDisplay
											showZero
											count={details?.TotalDonations ?? "?"}
										/>
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
			<p className="text-sm text-muted-foreground px-2">
				Last Updated: {format(new Date(), "Pp")}
			</p>
		</div>
	);
}
