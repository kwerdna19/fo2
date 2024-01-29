"use client";

import { BsGithub } from "react-icons/bs";
import { GrGamepad } from "react-icons/gr";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "~/components/ui/tooltip";

export function Footer() {
	return (
		<div className="flex justify-between w-full px-2 text-muted-foreground">
			<div className="text-sm">
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
						<TooltipTrigger className="text-3xl hover:text-black cursor-default">
							Δ
						</TooltipTrigger>
						<TooltipContent side="bottom">
							<p>Hail Delta!</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</div>
			<div className="flex gap-x-4 px-3 pt-1">
				<a
					className="block"
					href="https://fantasyonline2.com/"
					title="Play Fantasy Online 2"
				>
					<GrGamepad className="h-6 w-6" />
				</a>
				<a className="block" href="https://github.com/kwerdna19/fo2">
					<BsGithub className="h-6 w-6" />
				</a>
			</div>
		</div>
	);
}
