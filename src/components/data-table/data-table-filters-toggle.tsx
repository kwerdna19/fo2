import {
	PanelBottomClose,
	PanelBottomOpen,
	PanelLeftClose,
	PanelLeftOpen,
} from "lucide-react";
import React, { useEffect } from "react";
import { Button } from "~/components/ui/button";
import { Kbd } from "~/components/ui/kbd";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "~/components/ui/tooltip";

type Props = {
	sideBarOpen: boolean;
	setSideBarOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
	drawerOpen: boolean;
	setDrawerOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
	disabled: boolean;
};

export function DataTableFiltersToggle({
	sideBarOpen,
	setSideBarOpen,
	drawerOpen,
	setDrawerOpen,
	disabled,
}: Props) {
	const hideLabel = "Hide Filters";
	const showLabel = "Show Filters";

	useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if (e.key === "b" && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				setSideBarOpen((prev) => !prev);
			}
		};
		document.addEventListener("keydown", down);
		return () => document.removeEventListener("keydown", down);
	}, [setSideBarOpen]);

	return (
		<>
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							size="sm"
							variant="ghost"
							type="button"
							onClick={() => setSideBarOpen((prev) => !prev)}
							className="hidden lg:inline-flex"
							disabled={disabled}
						>
							{sideBarOpen ? (
								<>
									<PanelLeftClose className="mr-2 h-4 w-4" /> {hideLabel}
								</>
							) : (
								<>
									<PanelLeftOpen className="mr-2 h-4 w-4" /> {showLabel}
								</>
							)}
						</Button>
					</TooltipTrigger>
					<TooltipContent className="p-2">
						<span className="leading-none">Toggle controls with</span>
						<Kbd className="text-muted-foreground group-hover:text-accent-foreground ml-1.5">
							<span className="mr-1">⌘</span>
							<span>B</span>
						</Kbd>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>

			<Button
				size="sm"
				variant="ghost"
				type="button"
				onClick={() => setDrawerOpen((prev) => !prev)}
				className="lg:hidden"
				disabled={disabled}
			>
				{drawerOpen ? (
					<>
						<PanelBottomClose className="mr-2 h-4 w-4" /> {hideLabel}
					</>
				) : (
					<>
						<PanelBottomOpen className="mr-2 h-4 w-4" /> {showLabel}
					</>
				)}
			</Button>
		</>
	);
}
