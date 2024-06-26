import { parseWithZod } from "@conform-to/zod";
import type { z } from "zod";
import type { ConformServerAction, ErrorType } from "~/types/actions";
import { recursivelyNullifyUndefinedValues } from "./misc";

export const createConformAction = <Schema extends z.ZodTypeAny>(
	schema: Schema,
	fn: (
		input: z.output<Schema>,
		prev?: Parameters<ConformServerAction<ErrorType>>[0],
	) => Promise<unknown>,
): ConformServerAction<ErrorType> => {
	return async (previous, formData) => {
		const submission = parseWithZod(formData, { schema });

		if (submission.status !== "success") {
			return submission.reply();
		}

		try {
			const converted = recursivelyNullifyUndefinedValues(submission.payload);
			await fn(converted, previous);
			return submission.reply();
		} catch (e) {
			// server err with handler
			return submission.reply({
				formErrors: ["An unknown server error occurred."],
			});
		}
	};
};
