import {
	PanelBottomClose,
	PanelBottomOpen,
	PanelLeftClose,
	PanelLeftOpen,
} from "lucide-react";
import React from "react";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "~/components/ui/tooltip";
import { Button } from "../ui/button";

type Props = {
	sideBarOpen: boolean;
	setSideBarOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
	drawerOpen: boolean;
	setDrawerOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
};

export function DataTableFiltersToggle({
	sideBarOpen,
	setSideBarOpen,
	drawerOpen,
	setDrawerOpen,
}: Props) {
	const hideLabel = "Hide Filters";
	const showLabel = "Show Filters";

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
					<TooltipContent>
						<p>
							Toggle controls with{" "}
							{/* <Kbd className="ml-1 text-muted-foreground group-hover:text-accent-foreground">
							<span className="mr-0.5">⌘</span>
							<span>B</span>
						</Kbd> */}
						</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>

			<Button
				size="sm"
				variant="ghost"
				type="button"
				onClick={() => setDrawerOpen((prev) => !prev)}
				className="lg:hidden"
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
