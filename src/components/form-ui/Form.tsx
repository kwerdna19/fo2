"use client";
import { FormProvider, getFormProps } from "@conform-to/react";
import type { FormHTMLAttributes, ReactNode } from "react";
import { FormButton } from "~/components/FormButton";
import { Button } from "~/components/ui/button";
import type { useConform } from "~/hooks/useConform";
import { cn } from "~/utils/styles";

interface Props {
	form: ReturnType<typeof useConform>[0];
	action: FormHTMLAttributes<HTMLFormElement>["action"];
	submit?: string;
	children: ReactNode;
	className?: string;
}

export function Form({
	form,
	action,
	className,
	children,
	submit = "Submit",
}: Props) {
	return (
		<FormProvider context={form.context}>
			<form action={action} {...getFormProps(form)}>
				<div
					className={cn(
						"grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-8",
						className,
					)}
				>
					{children}
				</div>
				<div className="flex justify-end pt-4 space-x-5">
					<Button variant="ghost" {...form.reset.getButtonProps()}>
						Reset
					</Button>
					<FormButton disabled={!form.dirty}>{submit}</FormButton>
				</div>
			</form>
		</FormProvider>
	);
}
