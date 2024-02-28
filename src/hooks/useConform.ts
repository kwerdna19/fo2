"use client";

import { type FormOptions } from "@conform-to/dom";
import { useForm } from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import { useFormState } from "react-dom";
import { type z } from "zod";
import { type ConformServerAction, type ErrorType } from "~/types/actions";

// serverAction must be passed in from prop from a Server Component
export const useConform = <Schema extends z.ZodType>(
	serverAction: ConformServerAction<ErrorType>,
	{
		schema,
		...options
	}: Omit<
		FormOptions<z.output<Schema>, unknown>,
		| "lastResult"
		| "onValidate"
		| "lastSubmission"
		| "shouldValidate"
		| "shouldDirtyConsider"
		| "formId"
		| "constraint"
	> & {
		schema: Schema;
	},
) => {
	const [lastResult, action] = useFormState(serverAction, undefined);

	const [form, fields] = useForm<z.output<Schema>, ErrorType>({
		lastResult,
		onValidate({ formData }) {
			const parsed = parseWithZod(formData, { schema });
			return parsed;
		},
		constraint: getZodConstraint(schema),
		shouldValidate: "onBlur",
		shouldDirtyConsider(name) {
			return !name.startsWith("$ACTION");
		},
		...options,
	});

	return [form, fields, action, lastResult] as const;
};
