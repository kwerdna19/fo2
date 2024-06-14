"use client";

import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { toast } from "../ui/use-toast";

export const FormToast = ({
	successMessage,
	errorMessage,
}: {
	successMessage: string;
	errorMessage?: string;
}) => {
	const { formState } = useFormContext();

	const success = formState.isSubmitted && formState.isSubmitSuccessful;
	const error = formState.isSubmitted && !formState.isSubmitSuccessful;

	useEffect(() => {
		if (success) {
			toast({
				title: "Success",
				description: successMessage,
			});
		}
		if (error) {
			toast({
				title: "Error",
				description: errorMessage ?? "An unknown error occurred",
			});
		}
	}, [successMessage, errorMessage, success, error]);

	return null;
};
