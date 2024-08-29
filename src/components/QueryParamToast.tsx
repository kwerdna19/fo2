"use client"; // app router: only works in client components

import { useQueryState } from "nuqs";
import { useEffect } from "react";
import { useToast } from "./ui/use-toast";

type Props = {
	name: string;
	success?: string;
	error?: string;
};

export default function QueryParamToast({ name, success, error }: Props) {
	const [val, setVal] = useQueryState(name);

	const [placeholder, setPlaceholder] = useQueryState("placeholder");

	const { toast } = useToast();

	useEffect(() => {
		if (val === null) {
			return;
		}

		const getMessage = (str: string) => {
			if (!placeholder) {
				return str;
			}
			return str.replace(/\{placeholder\}/g, placeholder);
		};

		const isSuccess = val !== "false" && val !== "0" && val !== "error";
		if (isSuccess && success) {
			toast({
				variant: "destructive",
				title: "Success",
				description: getMessage(success),
				duration: 4000,
			});
		}
		if (!isSuccess && error) {
			toast({
				variant: "destructive",
				title: "Error",
				description: getMessage(error),
				duration: 4000,
			});
		}
		setVal(null);
		setPlaceholder(null);
	}, [val, setVal, success, error, toast, placeholder, setPlaceholder]);

	return null;
}
