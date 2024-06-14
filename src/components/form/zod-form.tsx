// https://github.com/trpc/examples-kitchen-sink/blob/main/src/feature/react-hook-form/Form.tsx

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { type ReactNode, useEffect, useId } from "react";
import {
	type FieldValues,
	FormProvider,
	type Path,
	type UseFormProps,
	type UseFormReturn,
	useForm,
	useFormContext,
} from "react-hook-form";
import type { z } from "zod";
import { Button, type ButtonProps } from "../ui/button";

export type UseZodForm<TInput extends FieldValues> = UseFormReturn<TInput> & {
	/**
	 * A unique ID for this form.
	 */
	id: string;
};
export function useZodForm<TSchema extends z.ZodType>(
	props: Omit<UseFormProps<TSchema["_input"]>, "resolver"> & {
		schema: TSchema;
	},
) {
	const form = useForm<TSchema["_input"]>({
		...props,
		resolver: zodResolver(props.schema, undefined, {
			// This makes it so we can use `.transform()`s on the schema without same transform getting applied again when it reaches the server
			raw: true,
		}),
	}) as UseZodForm<TSchema["_input"]>;

	form.id = useId();

	return form;
}

export function Form<TInput extends FieldValues>(
	props: Omit<React.ComponentProps<"form">, "onSubmit" | "id"> & {
		handleSubmit: (values: TInput) => Promise<unknown> | unknown;
		form: UseZodForm<TInput>;
		persist?: boolean;
		reset?: boolean;
		successComponent?: ReactNode;
	},
) {
	const {
		handleSubmit,
		form,
		persist,
		reset,
		successComponent,
		...passThrough
	} = props;

	const { isSubmitSuccessful } = form.formState;

	// biome-ignore lint/correctness/useExhaustiveDependencies: reset doesn't depend on form
	useEffect(() => {
		if (isSubmitSuccessful && (persist || reset)) {
			form.reset(persist ? (v) => v : undefined);
		}
	}, [isSubmitSuccessful, persist, reset]);

	if (successComponent && isSubmitSuccessful) {
		return successComponent;
	}

	return (
		<FormProvider {...form}>
			<form
				{...passThrough}
				id={form.id}
				onSubmit={(event) => {
					event.stopPropagation();
					form.handleSubmit(async (values) => {
						try {
							await handleSubmit(values);
						} catch (cause) {
							// TO BE REPLACED
							// if (cause && cause instanceof TRPCClientError) {
							// 	const data = cause.data?.zodError as
							// 		| { fieldErrors: Record<string, string[]> }
							// 		| undefined;
							// 	if (data?.fieldErrors) {
							// 		Object.keys(data.fieldErrors).map((fieldName) => {
							// 			return form.setError(fieldName as Path<TInput>, {
							// 				message:
							// 					data.fieldErrors[fieldName]?.join(", ") ??
							// 					"Unknown error",
							// 			});
							// 		});
							// 		return;
							// 	}
							// }

							form.setError("root", {
								message: (cause as Error)?.message ?? "Unknown error",
								type: "server",
							});
						}
					})(event);
				}}
			/>
		</FormProvider>
	);
}

export function SubmitButton<T extends FieldValues>(
	props: Omit<ButtonProps, "type" | "form"> & {
		/**
		 * Optionally specify a form to submit instead of the closest form context.
		 */
		form?: UseZodForm<T>;
		allowNonDirtySubmission?: boolean;
	},
) {
	const context = useFormContext();

	const form = props.form ?? context;
	if (!form) {
		throw new Error(
			"SubmitButton must be used within a Form or have a form prop",
		);
	}
	const { formState } = form;
	const { allowNonDirtySubmission, children, ...rest } = props;

	return (
		<Button
			type="submit"
			disabled={
				props.disabled || (!formState.isDirty && !allowNonDirtySubmission)
			}
			{...rest}
			form={props.form?.id}
		>
			{formState.isSubmitting && (
				<Loader2 className="animate-spin h-4 w-4 mr-2" />
			)}{" "}
			{children}
		</Button>
	);
}

export function ResetButton<T extends FieldValues>({
	form: formProp,
	...props
}: Omit<ButtonProps, "type" | "form"> & {
	/**
	 * Optionally specify a form to submit instead of the closest form context.
	 */
	form?: UseZodForm<T>;
}) {
	const context = useFormContext();

	const form = formProp ?? context;
	if (!form) {
		throw new Error(
			"SubmitButton must be used within a Form or have a form prop",
		);
	}
	const { formState, reset } = form;

	if (!formState.isDirty) {
		return;
	}

	return (
		<Button type="button" variant="ghost" onClick={() => reset()} {...props}>
			{props.children ?? "Reset"}
		</Button>
	);
}
