import { itemTypeMap } from "~/utils/fo-data/service";
import { cn } from "~/utils/styles";

type Props = {
	type: number;
	className?: string;
};

function ItemType({ type, className }: Props) {
	return (
		<div className={cn(className, "capitalize")}>
			{itemTypeMap[type]?.type.toLocaleLowerCase() ?? "?"}
		</div>
	);
}

export default ItemType;
