import { format } from "date-fns";
import { Pencil } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminButton } from "~/components/AdminButton";
import { IconSprite } from "~/components/IconSprite";
import { UnitSprite } from "~/components/UnitSprite";
import { Badge } from "~/components/ui/badge";
import { Card } from "~/components/ui/card";
import { api } from "~/trpc/server";

interface Params {
	slug: string;
}

export async function generateMetadata({ params }: { params: Params }) {
	const pass = await api.battlePass.getBySlug(params);
	if (!pass) {
		return {};
	}
	return {
		title: pass.name,
	};
}

export default async function BattlePass({ params }: { params: Params }) {
	const pass = await api.battlePass.getBySlug(params);

	if (!pass) {
		notFound();
	}

	return (
		<div className="w-full">
			<div className="flex gap-x-4">
				<h2 className="text-3xl">{pass.name}</h2>
				{/* <AdminButton
					size="icon"
					variant="outline"
					href={`/battlepass/${params.slug}/edit`}
				>
					<Pencil className="w-4 h-4" />
				</AdminButton> */}
			</div>
			<div className="flex items-center gap-x-3 pt-2 pb-4">
				<Badge>{pass.durationDays} days</Badge>
				<Badge variant="secondary">{pass.tiers.length} tiers</Badge>
				<Badge variant="outline">{pass.xpPerTier} XP / tier</Badge>
				{/* {format(pass.startDate, 'PP')}
      {pass.endDate ? ` - ${format(pass.endDate, 'PP')}` : <><Badge>Current</Badge></>} */}
			</div>
			<div className="space-y-3 max-w-screen-sm w-full pb-8">
				{pass.tiers.map((tier) => {
					const key = `${tier.battlePassId}.${tier.tier}`;

					const currency =
						tier.unit !== null ? (
							<div key={key} className="flex gap-x-4 items-center text-lg">
								<UnitSprite size="md" type={tier.unit} />
								{tier.amount ?? "???"}
							</div>
						) : null;

					const item =
						tier.item !== null ? (
							<div key={key} className="flex gap-x-4 items-center text-lg">
								<IconSprite size="sm" url={tier.item.spriteName} />
								<Link href={`/items/${tier.item.slug}`} prefetch={false}>
									{tier.item.name}
								</Link>
							</div>
						) : null;

					return (
						<Card key={key} className="flex w-full p-5 gap-x-8">
							<div className="text-xl font-sans flex justify-center items-center">
								<div className="text-center">
									<p className="text-xs text-muted-foreground">Tier</p>
									<p>{tier.tier}</p>
								</div>
							</div>
							<div className="flex-1 flex items-center gap-x-5 flex-wrap">
								{currency}
								{item}
								{currency === null && item === null && (
									<div className="text-lg">???</div>
								)}
							</div>
						</Card>
					);
				})}
			</div>
		</div>
	);
}
