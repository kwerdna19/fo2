"use client";

import Link from "next/link";
import * as React from "react";

import type { Area } from "@prisma/client";
import { usePathname } from "next/navigation";
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
	navigationMenuTriggerStyle,
} from "~/components/ui/navigation-menu";
import { cn } from "~/utils/styles";

type Areas = Pick<Area, "id" | "name" | "slug">[];

export function NavMenu({
	className,
	areas,
	mobile,
	children,
}: {
	className?: string;
	areas: Areas;
	mobile?: boolean;
	children?: React.ReactNode;
}) {
	const path = usePathname();

	const pathMatches = (str: string) => path === str;
	const pathStartsWith = (str: string) => path.startsWith(str);

	const itemClassName = cn(mobile && "w-full border max-w-96");

	const linkClassName = cn(navigationMenuTriggerStyle(), mobile && "w-full");

	return (
		<NavigationMenu className={className}>
			<NavigationMenuList
				className={cn(mobile && "flex flex-col gap-4 w-full space-x-0")}
			>
				<NavigationMenuItem className={itemClassName}>
					<NavigationMenuLink
						active={pathMatches("/mobs")}
						asChild
						className={linkClassName}
					>
						<Link prefetch={false} href="/mobs">
							Mobs
						</Link>
					</NavigationMenuLink>
				</NavigationMenuItem>
				<NavigationMenuItem className={itemClassName}>
					<NavigationMenuLink
						active={pathMatches("/items")}
						asChild
						className={linkClassName}
					>
						<Link prefetch={false} href="/items">
							Items
						</Link>
					</NavigationMenuLink>
				</NavigationMenuItem>
				<NavigationMenuItem className={itemClassName}>
					<NavigationMenuLink
						active={pathMatches("/npcs")}
						asChild
						className={linkClassName}
					>
						<Link prefetch={false} href="/npcs">
							Npcs
						</Link>
					</NavigationMenuLink>
				</NavigationMenuItem>
				<NavigationMenuItem className={itemClassName}>
					<NavigationMenuLink
						active={pathMatches("/skills")}
						asChild
						className={linkClassName}
					>
						<Link prefetch={false} href="/skills">
							Skills
						</Link>
					</NavigationMenuLink>
				</NavigationMenuItem>
				<NavigationMenuItem className={itemClassName}>
					<NavigationMenuLink asChild>
						<NavigationMenuTrigger className={cn(mobile && "w-full")}>
							Areas
						</NavigationMenuTrigger>
					</NavigationMenuLink>
					<NavigationMenuContent>
						<ul className="gap-3 p-3 md:w-[300px] lg:w-[400px]">
							<ListItem href="/areas" title="World Map">
								Full interactive world map.
							</ListItem>
							<hr className="my-2" />
							{areas.map((area) => (
								<ListItem
									key={area.id}
									href={`/areas/${area.slug}`}
									title={area.name}
								/>
							))}
						</ul>
					</NavigationMenuContent>
				</NavigationMenuItem>
				<NavigationMenuItem className={itemClassName}>
					<NavigationMenuLink
						active={pathMatches("/guilds")}
						asChild
						className={linkClassName}
					>
						<Link prefetch={false} href="/guilds">
							Guilds
						</Link>
					</NavigationMenuLink>
				</NavigationMenuItem>
				<NavigationMenuItem className={itemClassName}>
					<NavigationMenuLink
						active={pathStartsWith("/battlepass")}
						asChild
						className={linkClassName}
					>
						<Link prefetch={false} href="/battlepass">
							Battlepass
						</Link>
					</NavigationMenuLink>
				</NavigationMenuItem>
				{/* <NavigationMenuItem>
				<NavigationMenuLink active={pathMatches('/builds')} asChild className={linkClassName}>
					<Link prefetch={false} href="/max-builds">
						Max Builds
					</Link>
				</NavigationMenuLink>
			</NavigationMenuItem> */}
			</NavigationMenuList>
			{children}
		</NavigationMenu>
	);
}

const ListItem = React.forwardRef<
	React.ElementRef<"a">,
	React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
	return (
		<li>
			<NavigationMenuLink asChild>
				<a
					ref={ref}
					className={cn(
						"block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
						className,
					)}
					{...props}
				>
					<div className="text-sm font-medium leading-none">{title}</div>
					{children ? (
						<p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
							{children}
						</p>
					) : null}
				</a>
			</NavigationMenuLink>
		</li>
	);
});
ListItem.displayName = "ListItem";
