"use client";

import { type ReactNode, useEffect } from "react";
import {
	Drawer,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
} from "~/components/ui/drawer";
import { useBreakpoint } from "~/hooks/useBreakpoint";

export function DataTableSideBar({
	title,
	sideBarOpen,
	setSideBarOpen,
	drawerOpen,
	setDrawerOpen,
	children,
}: {
	setSideBarOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
	sideBarOpen: boolean;
	drawerOpen: boolean;
	setDrawerOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
	children: ReactNode;
	title?: string;
}) {
	const isDesktop = useBreakpoint("lg");

	useEffect(() => {
		if (isDesktop) {
			setDrawerOpen(false);
			if (drawerOpen) {
				setSideBarOpen(true);
			}
		}
	}, [setDrawerOpen, drawerOpen, isDesktop, setSideBarOpen]);

	if (!children) {
		return null;
	}

	return (
		<>
			<Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
				<DrawerContent className="">
					<DrawerHeader className="text-left">
						<DrawerTitle>{title}</DrawerTitle>
						{/* <DrawerDescription>{description}</DrawerDescription> */}
					</DrawerHeader>
					<div className="px-4 pb-8 pt-0">{children}</div>
				</DrawerContent>
			</Drawer>
			<div
				aria-hidden={!sideBarOpen}
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
		</>
	);
}
