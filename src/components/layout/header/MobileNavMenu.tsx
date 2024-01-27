"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	navigationMenuTriggerStyle,
} from "~/components/ui/navigation-menu";
import { cn } from "~/utils/styles";

export function MobileNavMenu({
	className,
	children,
}: {
	className?: string;
	children?: React.ReactNode;
}) {
	const path = usePathname();

	return (
		<NavigationMenu className={cn(className, "block max-w-none")}>
			<NavigationMenuList className="block space-x-0">
				{children}
			</NavigationMenuList>
		</NavigationMenu>
	);
}
