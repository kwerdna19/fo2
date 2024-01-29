"use client";
import { GiHealthNormal as Health } from "react-icons/gi";
import { cn } from "~/utils/styles";

export function MobHealth({
	health,
	className,
	iconClassName,
}: { health: number | string; className?: string; iconClassName?: string }) {
	return (
		<div className={cn("flex justify-center items-center gap-x-2", className)}>
			<Health className={cn("text-red-500 w-4 h-4", iconClassName)} />
			<div>{health}</div>
		</div>
	);
}
