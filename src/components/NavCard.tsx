import Link from "next/link";
import { type ReactNode } from "react";
import { cn } from "~/utils/styles";
import { Button } from "./ui/button";

interface Props {
	image: ReactNode;
	label: string;
	className?: string;
	href: string;
}

export default function NavCard({ image, label, className, href }: Props) {
	return (
		<Button
			className={cn("max-w-sm w-full p-5 pl-24 flex relative justify-start h-auto", className)}
			variant="outline"
			asChild
		>
			<Link prefetch={false} href={href}>
				<div className="flex items-center justify-center absolute left-6 h-full">{image}</div>
				<div className="text-2xl">{label}</div>
			</Link>
		</Button>
	);
}
