"use client";
import { addMinutes, formatDuration, intervalToDuration } from "date-fns";
import { Clock } from "lucide-react";
import { cn } from "~/utils/styles";

export function DurationDisplay({
	mins,
	className,
	iconClass,
}: { mins: number; className?: string; iconClass?: string }) {
	const d = new Date();

	const duration = intervalToDuration({
		start: d,
		end: addMinutes(d, mins),
	});

	const text = formatDuration(duration, {
		delimiter: "",
	}).replace(
		/(\s?(?:seconds?|minutes?|hours?|days?|weeks?|months?|years?))/g,
		(val) => val.trim().charAt(0),
	);

	return (
		<div className={cn("flex gap-x-1 items-center", className)}>
			<Clock className={cn("h-3 w-3", iconClass)} /> {text}
		</div>
	);
}
