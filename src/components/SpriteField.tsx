import { useMutation } from "@tanstack/react-query";
import { Check, Pencil } from "lucide-react";
import { useState } from "react";
import {
	type Control,
	type FieldPathByValue,
	type FieldValues,
	useFormContext,
} from "react-hook-form";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "~/components/ui/form";
import { type SpriteType, getSpriteSrc } from "~/utils/fo-sprite";
import { Sprite } from "./Sprite";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

type Props<FormShape extends FieldValues> = {
	control: Control<FormShape>;
	name: FieldPathByValue<FormShape, string>;
	type: SpriteType;
	placeholder?: string;
};

function SpriteInput({
	type,
	value,
	onChange,
	onError,
	onSuccess,
}: {
	type: SpriteType;
	value?: string | undefined;
	onChange: (v: string) => void;
	onError: (url: string) => void;
	onSuccess: () => void;
}) {
	const [edit, setEdit] = useState(!value);
	const [text, setText] = useState(value ?? "");

	const { mutate } = useMutation({
		mutationFn: async (input: string) => {
			const url = getSpriteSrc(type, input);
			const response = await fetch(url);
			if (!response.ok || response.status !== 200) {
				throw new Error("Error fetching sprite");
			}
			return input;
		},
		onSuccess(data) {
			onSuccess();
			onChange(data);
			setEdit(false);
		},
		onError(err, input) {
			onError(getSpriteSrc(type, input));
		},
	});

	const getSprite = (n: string) => {
		if (type === "NPC" || type === "MOB" || type === "PLAYER") {
			return (
				<Sprite
					className="border box-content rounded-sm"
					type={type}
					url={n}
					size="md"
				/>
			);
		}

		// Other types TBD?
	};

	return (
		<div>
			{edit ? (
				<div>
					<div className="flex gap-x-2">
						<Input
							className="flex-1"
							value={text}
							onChange={(e) => setText(e.target.value)}
							placeholder="e.g. enemy-crab"
						/>
						<Button
							size="icon"
							variant="ghost"
							type="button"
							disabled={!text}
							onClick={() => {
								if (value === text) {
									setEdit(false);
									onSuccess();
									return;
								}
								mutate(text);
							}}
						>
							<Check className="size-4" />
						</Button>
					</div>
				</div>
			) : null}
			{!edit && value ? (
				<Button
					variant="ghost"
					type="button"
					className="flex-shrink-0 p-0 relative h-auto"
					onClick={() => setEdit(true)}
				>
					{getSprite(value)}
					<Pencil className="absolute right-2 top-2 size-4" />
				</Button>
			) : null}
		</div>
	);
}

export function SpriteField<FormShape extends FieldValues>({
	control,
	name,
	type,
}: Props<FormShape>) {
	const form = useFormContext<FormShape>();

	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => (
				<FormItem>
					<FormLabel>Sprite</FormLabel>
					<FormControl>
						<SpriteInput
							type={type}
							value={field.value}
							onChange={field.onChange}
							onSuccess={() => form.clearErrors(name)}
							onError={(url) =>
								form.setError(name, {
									type: "validate",
									message: `Invalid sprite: ${url}`,
								})
							}
						/>
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
}
