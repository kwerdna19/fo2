"use client";
// https://claritydev.net/blog/display-warning-for-unsaved-form-data-on-page-exit

import { useEffect } from "react";
import { useFormContext } from "react-hook-form";

export const FormUnsavedPrompt = () => {
	const form = useFormContext();
	if (!form) {
		throw new Error("Must be used inside a Form");
	}

	const hasUnsavedChanges = form.formState.isDirty;

	useEffect(() => {
		const onBeforeUnload = (e: BeforeUnloadEvent) => {
			if (hasUnsavedChanges) {
				e.preventDefault();
				e.returnValue = "";
			}
		};
		window.addEventListener("beforeunload", onBeforeUnload);
		return () => {
			window.removeEventListener("beforeunload", onBeforeUnload);
		};
	}, [hasUnsavedChanges]);

	return null;
};
