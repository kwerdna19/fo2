"use client";

import type { User } from "@prisma/client";
import { ListChecks, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

import { Button } from "~/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

export function AuthMenu({
	className,
	user,
}: { className?: string; user?: User | undefined }) {
	const pathname = usePathname();

	if (!user) {
		if (pathname === "/login") {
			return null;
		}

		return (
			<Button size="sm" variant="outline" className={className} asChild>
				<Link href="/login">Login</Link>
			</Button>
		);
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" size="icon" className={className}>
					<img
						src="https://art.fantasyonline2.com/api/character/ss?f=body-1_eyes-standard-blue_hair-close-black&fr=0"
						alt="avatar"
						className="-mt-1"
					/>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="min-w-48">
				<DropdownMenuItem asChild>
					<Link href="/collection" prefetch={false}>
						<ListChecks className="size-4 mr-2" /> My Collection
					</Link>
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => signOut()}>
					<LogOut className="text-destructive size-4 mr-2" /> Log out
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
