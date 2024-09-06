import { itemTypeMap } from "~/utils/fo-data/service";
import { cn } from "~/utils/styles";

type Props = {
	type: number;
	subType: number;
	className?: string;
};

function ItemSubType({ type, subType, className }: Props) {
	const typeMap = itemTypeMap[type];

	if (!typeMap?.subTypes) {
		return null;
	}

	return (
		<div className={cn(className, "capitalize")}>
			{typeMap.subTypes[subType]?.replace(/_/g, " ").toLocaleLowerCase() ?? "?"}
		</div>
	);
}

export default ItemSubType;
