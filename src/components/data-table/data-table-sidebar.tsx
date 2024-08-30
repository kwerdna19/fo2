"use client";

import type { ReactNode } from "react";
import {
	Drawer,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
} from "~/components/ui/drawer";
import { useBreakpoint } from "~/hooks/useBreakpoint";

export function DataTableSideBar({
	title,
	open,
	setOpen,
	children,
}: {
	open: boolean;
	setOpen: (o: boolean) => void;
	children: ReactNode;
	title?: string;
}) {
	const isDesktop = useBreakpoint("lg");

	if (!isDesktop) {
		return (
			<>
				<Drawer open={open} onOpenChange={setOpen}>
					<DrawerContent>
						<DrawerHeader className="text-left">
							<DrawerTitle>{title}</DrawerTitle>
							{/* <DrawerDescription>{description}</DrawerDescription> */}
						</DrawerHeader>
						<div className="px-4 pb-8 pt-0">{children}</div>
					</DrawerContent>
				</Drawer>
			</>
		);
	}

	// desktop sidebar design TBD
	return (
		<div
			aria-hidden={!open}
			className="w-full hidden lg:flex flex-col sm:min-w-52 sm:max-w-52 md:min-w-64 md:max-w-64 lg:min-w-72 lg:max-w-72 aria-hidden:hidden p-3 border rounded-md sticky top-[88px] h-min min-h-80"
		>
			<DrawerHeader className="text-left p-0 pb-4">
				<div className="text-lg font-semibold leading-none tracking-tight">
					{title}
				</div>
				{/* <div className="text-sm text-muted-foreground">{description}</div> */}
			</DrawerHeader>
			{children}
		</div>
	);
}
