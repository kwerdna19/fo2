import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import React from "react";
import { Button } from "~/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "~/components/ui/tooltip";

type Props = {
	controlsOpen: boolean;
	setControlsOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
};

export function DataTableControlsToggle({
	controlsOpen,
	setControlsOpen,
}: Props) {
	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						size="sm"
						variant="ghost"
						onClick={() => setControlsOpen((prev) => !prev)}
					>
						{controlsOpen ? (
							<>
								<PanelLeftClose className="mr-2 h-4 w-4" /> Hide Controls
							</>
						) : (
							<>
								<PanelLeftOpen className="mr-2 h-4 w-4" /> Show Controls
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
	);
}
