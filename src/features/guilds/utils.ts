import type { paths } from "~/utils/fo-api/types.generated";
import { guildRankMap } from "~/utils/fo-game";

export type GuildMember =
	paths["/api/public/guild/members"]["post"]["responses"]["200"]["content"]["application/json"][number];

export const groupGuildMembers = (members: GuildMember[]) => {
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
		.sort((a, b) => b.rankId - a.rankId);

	return groups;
};
