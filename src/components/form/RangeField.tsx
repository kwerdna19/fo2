import {
	type Control,
	type FieldPathByValue,
	type FieldValues,
	useController,
} from "react-hook-form";
import { Label } from "../ui/label";
import { Slider, SliderThumb } from "../ui/slider";

type Props<FormShape extends FieldValues> = {
	label: string;
	control: Control<FormShape>;
	nameMax: FieldPathByValue<FormShape, number | null | undefined>;
	nameMin: FieldPathByValue<FormShape, number | null | undefined>;
	maxValue: number;
	minValue?: number;
};

function RangeField<FormShape extends FieldValues>({
	label,
	control,
	nameMax,
	nameMin,
	maxValue,
	minValue = 0,
}: Props<FormShape>) {
	const { field: maxField } = useController({ control, name: nameMax });
	const { field: minField } = useController({ control, name: nameMin });

	const value = [
		minField.value ?? minValue,
		maxField.value ?? maxValue,
	] satisfies [number, number];

	return (
		<div className="space-y-4">
			<Label>
				{label}
				<span className="ml-2">
					{value[0] === value[1]
						? `(${value[0]})`
						: `(${value[0]} - ${value[1]})`}
				</span>
			</Label>
			<div className="px-1">
				<Slider
					min={minValue}
					max={maxValue}
					onValueChange={(vals) => {
						console.log(vals);
						minField.onChange(vals[0] === minValue ? null : vals[0]);
						maxField.onChange(vals[1] === maxValue ? null : vals[1]);
					}}
					value={value}
					step={1}
				>
					<SliderThumb />
				</Slider>
			</div>
		</div>
	);
}

export default RangeField;
