"use client";

import Link from "next/link";
import { BsGithub } from "react-icons/bs";
import { GrGamepad } from "react-icons/gr";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "~/components/ui/tooltip";
import { ModeToggle } from "./ModeToggle";

export function Footer() {
	return (
		<div className="w-full flex flex-wrap px-2 justify-between text-muted-foreground gap-y-3 gap-x-4">
			<div className="text-sm ">
				<div>
					Site Admin: <span className="font-semibold">Ak</span>
				</div>
				<div>
					Site Mod: <span className="font-semibold">Dino</span>
				</div>
				<div>
					Art: <span className="font-semibold">Perseus</span>
				</div>
				<div>
					Fantasy Online 2: <span className="font-semibold">Gamer</span>
				</div>
			</div>
			<div>
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger className="text-3xl hover:text-foreground" asChild>
							<Link href="/guilds/Delta">Δ</Link>
						</TooltipTrigger>
						<TooltipContent side="bottom">
							<p>Hail Delta!</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</div>
			<div className="flex gap-x-8">
				<div className="flex gap-x-4 py-2">
					<a
						className="block hover:text-foreground"
						href="https://fantasyonline2.com/"
						title="Play Fantasy Online 2"
					>
						<GrGamepad className="h-6 w-6" />
					</a>
					<a
						className="block hover:text-foreground"
						href="https://github.com/kwerdna19/fo2"
						title="FO2DB GitHub"
					>
						<BsGithub className="h-6 w-6" />
					</a>
				</div>
				<ModeToggle />
			</div>
		</div>
	);
}
