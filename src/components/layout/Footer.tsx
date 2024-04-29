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

export function Footer() {
	return (
		<div className="w-full px-2">
			<div className="flex justify-between text-muted-foreground">
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
							<TooltipTrigger className="text-3xl hover:text-foreground cursor-default">
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
			</div>
			{/* <div className="text-center text-sm text-muted-foreground">
				We are looking for UI/UX design help. For more info, message{" "}
				<code>Ak</code>
			</div> */}
		</div>
	);
}
