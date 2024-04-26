"use client";

import { MenuIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { ModeToggle } from "~/components/ModeToggle";
import { UnitSprite } from "~/components/UnitSprite";
import { Button } from "~/components/ui/button";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "~/components/ui/collapsible";
import type { getAllAreasQuick } from "~/features/areas/requests";
import { NavMenu } from "./NavMenu";

type Areas = NonNullable<Awaited<ReturnType<typeof getAllAreasQuick>>>;

export function Header({
	areas,
	className,
}: { areas: Areas; className?: string }) {
	const [open, setOpen] = useState(false);

	return (
		<Collapsible className={className} open={open} onOpenChange={setOpen}>
			<div className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-x-5 px-4 py-3">
				<Link
					prefetch={false}
					href="/"
					className="flex gap-x-4 items-center px-3"
				>
					<UnitSprite type="GEMS" size="lg" />
					<h1>FO2 DB</h1>
				</Link>
				<div className="hidden flex-1 lg:block">
					<NavMenu areas={areas} />
				</div>

				<div className="hidden items-center lg:flex">
					<ModeToggle />
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
				<NavMenu areas={areas} className="w-full block p-4 max-w-none" mobile />
			</CollapsibleContent>
		</Collapsible>
	);
}
