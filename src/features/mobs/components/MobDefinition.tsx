"use client";
import { format } from "date-fns";
import { RefreshCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { DefinitionView } from "~/components/DefinitionView";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";
import { mobDefinitionFields } from "~/utils/fo-data/service";
import { cn } from "~/utils/styles";
import { type MobDatum, mobTableColumns } from "./MobTable";

export function MobDefinitionView({ mob }: { mob: MobDatum }) {
	const router = useRouter();

	const { mutate, isPending } = api.mob.syncDefinition.useMutation({
		onSuccess: () => {
			router.refresh();
		},
	});

	return (
		<div>
			<div className="pb-3 flex justify-between">
				<div>
					<div className="text-lg leading-none pb-1">Mob Definition</div>
					<div className="text-sm text-muted-foreground">
						Last synced: {format(mob.definitionUpdatedAt, "PPp")}
					</div>
				</div>
				<Button
					size="sm"
					disabled={isPending}
					onClick={() => mutate({ inGameId: mob.inGameId })}
				>
					<RefreshCcw
						className={cn("size-4 mr-2", isPending && "animate-spin")}
					/>
					Sync
				</Button>
			</div>
			<DefinitionView
				columns={mobTableColumns}
				datum={mob}
				definitionFields={mobDefinitionFields}
			/>
		</div>
	);
}
