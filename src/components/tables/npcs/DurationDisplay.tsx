"use client";
import { addMinutes, formatDuration, intervalToDuration } from "date-fns";
import { Clock } from "lucide-react";

export function DurationDisplay({ mins }: { mins: number }) {
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
		<div className="flex gap-x-1 items-center">
			<Clock className="h-3 w-3" /> {text}
		</div>
	);
}
