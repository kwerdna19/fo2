"use client";

import type { User } from "@prisma/client";
import { MenuIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { UnitSprite } from "~/components/UnitSprite";
import { Button } from "~/components/ui/button";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "~/components/ui/collapsible";
import type { RouterOutputs } from "~/trpc/react";
import { AuthMenu } from "../AuthMenu";
import { NavMenu } from "./NavMenu";

type Areas = RouterOutputs["area"]["getAllQuick"];

export function Header({
	areas,
	className,
	user,
}: { areas: Areas; className?: string; user: User | undefined }) {
	const [open, setOpen] = useState(false);

	return (
		<Collapsible className={className} open={open} onOpenChange={setOpen}>
			<div className="min-h-16 grid lg:grid-cols-[auto_1fr_auto] grid-cols-[auto_1fr_auto_auto] items-center gap-x-5 px-4 py-3 h-full">
				<Link
					prefetch={false}
					href="/"
					className="flex gap-x-4 items-center px-3"
				>
					<UnitSprite type="GEMS" size="md" />
					<h1>FO2 DB</h1>
				</Link>
				<div className="hidden flex-1 lg:block">
					<NavMenu areas={areas} />
				</div>

				<div className="hidden items-center lg:flex">
					<AuthMenu user={user} />
				</div>

				<div className="col-span-3 flex justify-end lg:col-span-1 lg:hidden">
					<CollapsibleTrigger asChild>
						<Button size="icon" variant="ghost">
							{open ? (
								<XIcon className="h-6 w-6" />
							) : (
								<MenuIcon className="h-6 w-6" />
							)}
						</Button>
					</CollapsibleTrigger>
				</div>
			</div>
			<CollapsibleContent className="col-span-full lg:hidden">
				<NavMenu
					areas={areas}
					className="w-full flex-col p-4 max-w-none shadow-md items-stretch"
					mobile
				>
					<AuthMenu className="my-6 self-center" user={user} />
				</NavMenu>
			</CollapsibleContent>
		</Collapsible>
	);
}
