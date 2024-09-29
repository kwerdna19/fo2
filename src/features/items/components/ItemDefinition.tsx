"use client";
import { format } from "date-fns";
import { RefreshCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { DefinitionView } from "~/components/DefinitionView";
import { Button } from "~/components/ui/button";
import {
	type ItemDatum,
	itemTableColumns,
} from "~/features/items/components/ItemTable";
import { api } from "~/trpc/react";
import { itemDefinitionFields } from "~/utils/fo-data/service";
import { cn } from "~/utils/styles";

export function ItemDefinitionView({ item }: { item: ItemDatum }) {
	const router = useRouter();

	const { mutate, isPending } = api.item.syncDefinition.useMutation({
		onSuccess: () => {
			router.refresh();
		},
	});

	return (
		<div>
			<div className="pb-3 flex justify-between">
				<div>
					<div className="text-lg leading-none pb-1">Item Definition</div>
					<div className="text-sm text-muted-foreground">
						Last synced: {format(item.definitionUpdatedAt, "PPp")}
					</div>
				</div>
				<Button size="sm" disabled={isPending} onClick={() => mutate(item.id)}>
					<RefreshCcw
						className={cn("size-4 mr-2", isPending && "animate-spin")}
					/>
					Sync
				</Button>
			</div>
			<DefinitionView
				columns={itemTableColumns}
				datum={item}
				definitionFields={itemDefinitionFields}
			/>
		</div>
	);
}
